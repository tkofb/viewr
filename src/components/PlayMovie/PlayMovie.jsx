import React, { useState, useEffect } from "react";
import "./PlayMovie.css";
import axios from "axios";

const PlayMovie = ({ mediaId }) => {
  const [mediaInfo, setMediaInfo] = useState();

  const getMovieInfo = async () => {
    const response = await axios.post(`http://localhost:8080/getMovieInfo`, {
      mediaId: mediaId,
    });

    console.log(response.data)
    setMediaInfo(response.data);
  };

  useEffect(() => {
    getMovieInfo()
  }, [mediaId]);

  return <div>PlayMovie {mediaId}</div>;
};

export default PlayMovie;
