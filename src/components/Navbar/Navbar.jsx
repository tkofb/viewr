import React from "react";
import "./Navbar.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const handleSession = async () => {
    const tokenResponse = await axios.get(
      `http://localhost:8080/approveSession`
    );
    const tokenData = tokenResponse.data;

    const redirect_url = "http://localhost:5173/approved";
    const url = `https://www.themoviedb.org/authenticate/${tokenData["request_token"]}?redirect_to=${redirect_url}`;
    window.location.href = url;

    console.log(tokenData);
  };

  const onAlienClick = () => {
    console.log("hola");
    navigate("/");
  };

  return (
    <nav>
      <img src="alien.svg" alt="logo" onClick={onAlienClick} />
      <button onClick={handleSession}>login</button>
    </nav>
  );
};

export default Navbar;
