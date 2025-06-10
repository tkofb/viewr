import "./Card.css";
import React from "react";
import { useNavigate } from "react-router-dom";
import playIcon from "../../assets/play.svg";

const Card = ({ mediaInfo }) => {
  let navigate = useNavigate();

  const addMedia = () => {
    navigate("search");
  };

  const playMedia = (mediaId, isTV) => {
    const mediaType = isTV ? "tv" : "movie";
    navigate(`/play/${mediaType}/${mediaId}`);
  };

  const showInfo = (mediaId, isTV) => {
    const mediaType = isTV ? "tv" : "movie";
    navigate(`/${mediaType}/${mediaId}`);
  };

  const onClick = (e) => {
    if (!e.target.classList.contains("clickPlay")) {
      showInfo(e.currentTarget.id, e.currentTarget.classList.contains("tv"));
    }
  };

  const handleClick = (e) => {
    console.log(e.target)
    console.log(mediaInfo)
    playMedia(mediaInfo.id, (mediaInfo.name != null));
    console.log("click");
  };

  const handleMediaInfo = (info) => {
    const randomTilt = Math.random() > 0.5 ? "tiltLeft" : "tiltRight";

    return (
      <div
        className={`mediaCard ${info.title ? "movie" : "tv"} ${randomTilt}`}
        id={info.id}
        onClick={onClick}
      >
        <img
          src={`https://image.tmdb.org/t/p/original/${
            info.poster_path || info.backdrop_path
          }`}
          alt="media card info"
        />

        <div className="text">
          <div className="title">{info.title || info.name}</div>
          <div className="details">
            <div className="year">
              {info.title
                ? info.release_date.substring(0, 4)
                : info.first_air_date.substring(0, 4)}
            </div>
            <div className="mediaType">{info.name ? "TV" : "Movie"}</div>
            <div className="clickPlay" onClick={handleClick}>
              <img src={playIcon} alt="play icon" className="playIcon" /> Watch
            </div>
          </div>
        </div>
      </div>
    );
  };

  const handleEmptyCard = () => {
    return (
      <div className="emptyCard tiltRight" onClick={addMedia}>
        <div className="mediaHolder">+</div>
      </div>
    );
  };

  return mediaInfo ? handleMediaInfo(mediaInfo) : handleEmptyCard();
};

export default Card;
