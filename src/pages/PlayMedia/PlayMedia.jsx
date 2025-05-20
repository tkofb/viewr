import React from "react";
import "./PlayMedia.css";
import { useParams } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import PlayMovie from "./PlayMovie";
import PlayTV from "./PlayTV/PlayTV";

const PlayMedia = () => {
  const { mediaId, mediaType } = useParams();

  // Assume sessionId for login characteristics
  const sessionId = localStorage.getItem('sessionId')

  return (
    <div className="mediaPlayerHolder">
      <Navbar sessionId={sessionId}/>

      {mediaType == "tv" ? (
        <PlayTV mediaId={mediaId} />
      ) : (
        <PlayMovie mediaId={mediaId} />
      )}
    </div>
  );
};

export default PlayMedia;
