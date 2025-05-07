import React from "react";
import "./MediaPlayer.css";
import PlayShow from "../../components/PlayShow/PlayShow";
import { useLocation } from "react-router-dom";
import PlayMovie from "../../components/PlayMovie/PlayMovie";

const MediaPlayer = () => {
  const location = useLocation();
  const { mediaInfo } = location.state || {};

  return (
    <>
      {mediaInfo.media_type == "tv" ? (
        <PlayShow mediaId={mediaInfo.id} />
      ) : (
        <PlayMovie mediaId={mediaInfo.id} />
      )}
    </>
  );
};

export default MediaPlayer;
