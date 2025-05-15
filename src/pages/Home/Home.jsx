import React, { useEffect, useState } from "react";
import Card from "../../components/Card/Card";
import Navbar from "../../components/Navbar/Navbar";
import "./Home.css";
import { useLocation } from "react-router-dom";
import axios from "axios";

const Home = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const [sessionId, setSessionId] = useState(localStorage.getItem("sessionId"));
  const [favoriteMovies, setFavoriteMovies] = useState(null);
  const [favoriteTV, setFavoriteTV] = useState(null);

  const createSession = async () => {
    const response = await axios.get(
      `http://localhost:8080/createSession?requestToken=${searchParams.get(
        "request_token"
      )}`
    );

    const sessionCreated = response.data.success;
    if (sessionCreated) {
      const currSessionId = response.data.session_id;
      localStorage.setItem("sessionId", currSessionId);
      setSessionId(currSessionId);
    }
  };

  useEffect(() => {
    if (searchParams.get("approved")) {
      createSession();
    }
  }, []);

  useEffect(() => {
    const handleFavorites = async () => {
      const userInfo = await axios.post(
        `http://localhost:8080/getAccountInfo`,
        {
          sessionId: sessionId,
        }
      );

      const tvFavorites = await axios.post(
        `http://localhost:8080/getFavoriteTV`,
        {
          sessionId: sessionId,
          id: userInfo.data.id,
        }
      );
      const movieFavorites = await axios.post(
        `http://localhost:8080/getFavoriteMovies`,
        {
          sessionId: sessionId,
          id: userInfo.data.id,
        }
      );

      setFavoriteTV(tvFavorites.data.results);
      setFavoriteMovies(movieFavorites.data.results);
    };

    handleFavorites();
  }, [sessionId]);

  return (
    <div className="home">
      <Navbar sessionId={sessionId} />

      <div className="favorites">
        {favoriteMovies &&
          favoriteMovies.map((elem) => {
            return <Card mediaInfo={elem} />;
          })}

        {favoriteTV &&
          favoriteTV.map((elem) => {
            return <Card mediaInfo={elem} />;
          })}
        <Card />
      </div>
    </div>
  );
};

export default Home;
