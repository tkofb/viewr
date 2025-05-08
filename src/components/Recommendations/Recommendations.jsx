import React, { useEffect, useState } from "react";
import "./Recommendations.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Recommendations = ({ recommendations, amt }) => {
  const navigate = useNavigate();
  const [mediaInfoList, setMediaInfo] = useState([]);
  const [currRecInfo, setCurrRecInfo] = useState(new Map());

  useEffect(() => {
    setMediaInfo(null);

    const handleIds = async () => {
      if (!recommendations || recommendations.length === 0) return;

      const mediaList = [];

      for (const rec of recommendations) {
        const response = await axios.post("http://localhost:8080/getShowInfo", {
          mediaId: rec.id,
        });
        mediaList.push(response.data);
      }

      setMediaInfo(mediaList);
    };

    handleIds();
  }, [recommendations]);

  useEffect(() => {
    if (mediaInfoList) {
      const newMap = new Map();
      for (const media of mediaInfoList) {
        newMap.set(media.id.toString(), media);
      }
      setCurrRecInfo(newMap);
    }
  }, [mediaInfoList]);

  const playMedia = (mediaId) => {
    const media_type = currRecInfo.get(mediaId).name ? "tv" : "movie";
    navigate(`/play/${media_type}/${mediaId}`);
  };

  const onClick = (e) => {
    playMedia(e.currentTarget.id);
  };

  const handleRec = (rec) => {
    if (rec.media_type === "movie") {
      return <div>{rec.name}</div>;
    } else {
      return tvRecDisplay(rec);
    }
  };

  const handleMouseEnter = (e) => {
    e.currentTarget.classList.add("active");
  };

  const handleMouseLeave = (e) => {
    e.currentTarget.classList.remove("active");
  };

  const tvRecDisplay = (rec) => {
    return (
      <div
        className="individualRecommendations"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={onClick}
        id={rec.id}
      >
        <img
          src={`https://image.tmdb.org/t/p/original/${
            rec.poster_path || rec.backdrop_path
          }`}
          alt="media poster image"
        />
        <div className="title">{rec.name}</div>
        <div className="details">
          <div className="seasons">SS: {rec.number_of_seasons}</div>
          <div className="episodes">EPS: {rec.number_of_episodes}</div>
          <div className="mediaType">{rec.name ? "TV" : "MOVIE"}</div>
        </div>
      </div>
    );
  };

  return (
    <div className="recommendationsHolder">
      {mediaInfoList != null && (
        <>
          <h2>Recommendations</h2>
          <div className="recommendations">
            {mediaInfoList.slice(0, amt).map((rec) => handleRec(rec))}
          </div>
        </>
      )}
    </div>
  );
};

export default Recommendations;
