import React from "react";
import "./MediaPlayer.css";
import { useLocation } from "react-router-dom";

const MediaPlayer = () => {
  const location = useLocation();
  const { mediaId } = location.state || {};
  console.log(mediaId)

  return <div>MediaPlayer: {mediaId}</div>;
};

export default MediaPlayer;
