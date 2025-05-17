import React from "react";
import "./MediaInfo.css";
import { useParams } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import MovieInfo from "../../components/MovieInfo/MovieInfo";
import TVInfo from "../../components/TVInfo/TVInfo";

const MediaInfo = () => {
  const { mediaId, mediaType } = useParams();

  // Assume sessionId for login characteristics
  const sessionId = localStorage.getItem('sessionId')

  return (
    <div className="mediaPlayerHolder">
      <Navbar sessionId={sessionId}/>


      {mediaType == "tv" ? (
        <TVInfo mediaId={mediaId} />
      ) : (
        <MovieInfo mediaId={mediaId} />
      )}
    </div>
  );
};

export default MediaInfo;
