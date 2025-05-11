import React, { useEffect, useState } from "react";
import Card from "../../components/Card/Card";
import Navbar from "../../components/Navbar/Navbar";
import "./Home.css";
import { useLocation } from "react-router-dom";
import axios from "axios";

const Home = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const [sessionId, setSessionId] = useState(localStorage.getItem('sessionId'))

  const createSession = async () => {
    const response = await axios.get(
      `http://localhost:8080/createSession?requestToken=${searchParams.get(
        "request_token"
      )}`
    );
    
    const sessionCreated = response.data.success
    if (sessionCreated) {
      const currSessionId = response.data.session_id
      localStorage.setItem("sessionId", currSessionId);
      setSessionId(currSessionId)
    }
  };

  useEffect(() => {
    if (searchParams.get("approved")) {
      createSession();
    }
  }, []);

  return (
    <div className="home">
      <Navbar sessionId={sessionId}/>
      <Card />
    </div>
  );
};

export default Home;
