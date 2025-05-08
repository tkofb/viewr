import React from "react";
import "./MediaPlayer.css";
import PlayShow from "../../components/PlayShow/PlayShow";
import { useParams } from "react-router-dom";
import PlayMovie from "../../components/PlayMovie/PlayMovie";

const MediaPlayer = () => {
  const { mediaId, mediaType } = useParams();

  return (
    <>
      {mediaType == "tv" ? (
        <PlayShow mediaId={mediaId} />
      ) : (
        <PlayMovie mediaId={mediaId} />
      )}
    </>
  );
};

export default MediaPlayer;
