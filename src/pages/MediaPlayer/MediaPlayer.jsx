import React from "react";
import "./MediaPlayer.css";
import PlayShow from "../../components/PlayShow/PlayShow";
import { useParams } from "react-router-dom";
import PlayMovie from "../../components/PlayMovie/PlayMovie";
import Navbar from "../../components/Navbar/Navbar";

const MediaPlayer = () => {
  const { mediaId, mediaType } = useParams();

  // Assume sessionId for login characteristics
  const sessionId = localStorage.getItem('sessionId')

  return (
    <div className="mediaPlayerHolder">
      <Navbar sessionId={sessionId}/>


      {mediaType == "tv" ? (
        <PlayShow mediaId={mediaId} />
      ) : (
        <PlayMovie mediaId={mediaId} />
      )}
    </div>
  );
};

export default MediaPlayer;
