import React, { useState, useEffect } from "react";
import "./MediaSearch.css";
import homeLogo from "../../assets/home.png";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const MediaSearch = () => {
  const navigate = useNavigate();
  const [mediaList, setMediaList] = useState([]);
  const [mediaInfo, setMediaInfo] = useState(new Map());

  useEffect(() => {
    const newMap = new Map();
    for (const media of mediaList) {
      newMap.set(media.id.toString(), media);
    }
    setMediaInfo(newMap);
  }, [mediaList]);

  const playMedia = (mediaId) => {
    navigate("/play", {
      state: { mediaInfo: mediaInfo.get(mediaId) },
    });
  };

  const handleTextChange = async (e) => {
    const searchTerm = e.target.value.trim();
    if (searchTerm) {
      const response = await axios.post(`http://localhost:8080/searchMedia`, {
        query: searchTerm,
      });

      setMediaList(response.data);
    }
  };

  const description = (desc) => {
    if (desc.length >= 540) {
      return desc.slice(0, 540) + "...";
    }

    return desc;
  };

  const onClick = (e) => {
    playMedia(e.currentTarget.id);
  };

  const handleMouseEnter = (e) => {
    e.currentTarget.classList.add("active");
  };

  const handleMouseLeave = (e) => {
    e.currentTarget.classList.remove("active");
  };

  const handleDate = (date) => {
    if (null) {
      return null;
    }

    var options = {
      month: "short",
      day: "numeric",
      year: "numeric",
    };
    var datetime = new Date(date);

    return datetime.toLocaleDateString("en-US", options);
  };

  const listMedia = (media) => {
    return (
      <div
        id={media.id}
        className="media"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={onClick}
      >
        <img
          src={`https://image.tmdb.org/t/p/original/${
            media.poster_path || media.backdrop_path
          }`}
          alt="media poster image"
        />
        <div className="text">
          <h2>{media.title || media.name}</h2>
          <p>{description(media.overview)}</p>
          <div className="details">
            <div className="mediaType">{media.media_type.toUpperCase()}</div>
            <div className="voteAverage">{media.vote_average.toFixed(1)}</div>
            <div className="releaseDate">
              {handleDate(media.first_air_date || media.release_date)}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="search">
      <div className="inputAndHome">
        <input type="text" onKeyDown={handleTextChange} />
        <a href="/">
          <img src={homeLogo} alt="Home Logo" />
        </a>
      </div>
      <div className="mediaList">
        {mediaList.map((media) => listMedia(media))}
      </div>
    </div>
  );
};

export default MediaSearch;
