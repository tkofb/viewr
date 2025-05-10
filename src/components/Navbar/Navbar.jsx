import React from "react";
import "./Navbar.css";
import axios from "axios";

const Navbar = () => {
  const handleSession = async () => {
    const tokenResponse = await axios.get(
      `http://localhost:8080/createSession`
    );
    const tokenData = tokenResponse.data;

    const redirect_url = "http://localhost:5173/approved";
    const url = `https://www.themoviedb.org/authenticate/${tokenData["request_token"]}?redirect_to=${redirect_url}`;
    window.location.href = url;

    console.log(tokenData);
  };

  return (
    <nav>
      <img src="alien.svg" alt="logo" />
      <button onClick={handleSession}>login</button>
    </nav>
  );
};

export default Navbar;
