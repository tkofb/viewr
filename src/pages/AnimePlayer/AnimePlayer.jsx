import React from "react";
import "./AnimePlayer.css";
import { useLocation } from "react-router-dom";
import movieInfo from "movie-info";

const AnimePlayer = () => {
  const location = useLocation();
  const { animeName } = location.state || {};
  console.log(movieInfo(animeName))

  return <div>AnimePlayer {animeName}</div>;
};

export default AnimePlayer;
