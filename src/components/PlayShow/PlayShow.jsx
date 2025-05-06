import React, { useState, useEffect } from "react";
import "./PlayShow.css";
import axios from "axios";

const PlayShow = ({ mediaId }) => {
  console.log(mediaId)
  const [mediaInfo, setMediaInfo] = useState();

  const getShowInfo = async () => {
    const response = await axios.post(`http://localhost:8080/getShowInfo`, {
      mediaId: mediaId,
    });

    console.log(response.data)
    setMediaInfo(response.data);
  };

  useEffect(() => {
    getShowInfo()
  }, [mediaId]);

  return <div>PlayShow: {mediaId}</div>;
};

export default PlayShow;