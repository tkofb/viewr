import React, { useEffect, useState } from "react";
import "./Recommendations.css";
import axios from "axios";

const Recommendations = ({ recommendations, amt }) => {
  const [mediaInfoList, setMediaInfo] = useState([]);

  useEffect(() => {
    const handleIds = async () => {
      if (!recommendations || recommendations.length === 0) return;

      const mediaList = [];


      for (const rec of recommendations) {
        const response = await axios.post("http://localhost:8080/getShowInfo", {
          mediaId: rec.id,
        });
        mediaList.push(response.data);
      }

      setMediaInfo(mediaList)
      console.log("Fetched media info:", mediaList);
    };

    handleIds();
  }, [recommendations]);

  const handleRec = (rec) => {
    console.log(rec)
    if (rec.media_type === "movie") {
      return <div>{rec.name}</div>;
    } else {
      return tvRecDisplay(rec);
    }
  };

  const tvRecDisplay = (rec) => {
    return (
      <div className="individualRecommendations">
        <img
          src={`https://image.tmdb.org/t/p/original/${
            rec.poster_path || rec.backdrop_path
          }`}
          alt="media poster image"
        />
        <div>{rec.name}</div>
        <div className="details">
          <div>SS: {rec.number_of_seasons}</div>
          <div>EPS: {rec.number_of_episodes}</div>
          <div className="mediaType">{rec.name ? "TV" : "MOVIE"}</div>
        </div>
      </div>
    );
  };

  return (
      <div className="recommendations">
        {mediaInfoList.slice(0, amt).map((rec) => handleRec(rec))}
      </div>
    );
};

export default Recommendations;
