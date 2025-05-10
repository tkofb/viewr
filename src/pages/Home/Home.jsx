import React, { useEffect } from "react";
import Card from "../../components/Card/Card";
import Navbar from "../../components/Navbar/Navbar";
import "./Home.css";
import { useLocation } from "react-router-dom";
import axios from "axios";

const Home = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  const createSession = async () => {
    console.log(searchParams.get("request_token"));
    console.log(
      `http://localhost:8080/createSession?requestToken=${searchParams.get(
        "request_token"
      )}`
    );
    const response = await axios.get(
      `http://localhost:8080/createSession?requestToken=${searchParams.get(
        "request_token"
      )}`
    );

    console.log(response);
  };

  useEffect(() => {
    if (searchParams.get("approved")) {
      createSession();
    }
  }, []);

  return (
    <div className="home">
      <Navbar />
      <Card />
    </div>
  );
};

export default Home;
