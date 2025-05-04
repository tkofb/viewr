import React from "react";
import "./MediaPlayer.css";
import { useLocation } from "react-router-dom";

const MediaPlayer = () => {
  const location = useLocation();
  const { mediaInfo } = location.state || {};
  console.log(mediaInfo)

  return <div>MediaPlayer:</div>;
};

export default MediaPlayer;
