import React, { useState, useEffect } from "react";
import "./TVInfo.css";
import axios from "axios";
import Recommendations from "../Recommendations/Recommendations";
import playIcon from "../../assets/play.svg";
import notAFavoriteIcon from "../../assets/notAFavorite.svg";
import favoriteIcon from "../../assets/favorite.svg";
import { useNavigate } from "react-router-dom";

const TVInfo = ({ mediaId }) => {
  const [mediaInfo, setMediaInfo] = useState();
  const sessionId = localStorage.getItem("sessionId");
  const [isFavorite, setIsFavorite] = useState(false);
  const navigate = useNavigate() 

  useEffect(() => {
    const getShowInfo = async () => {
      const response = await axios.post(`http://localhost:8080/getShowInfo`, {
        mediaId: mediaId,
        sessionId: sessionId,
      });

      setIsFavorite(response.data.account_states.favorite);
      setMediaInfo(response.data);
    };

    getShowInfo();
  }, [mediaId]);

  const extractNames = (lst, amt) => {
    return lst
      .slice(0, amt)
      .reduce((accum, currValue) => accum + `${currValue.name}, `, "")
      .slice(0, -2);
  };

  const hoverFavoriteEnter = (e) => {
    e.currentTarget.src = favoriteIcon;
  };

  const hoverFavoriteLeave = (e) => {
    if (!isFavorite) {
      e.currentTarget.src = notAFavoriteIcon;
    }
  };

  const toggleFavoriteMedia = async (mediaId, mediaType) => {
    const userInfo = await axios.post(`http://localhost:8080/getAccountInfo`, {
      sessionId: sessionId,
    });

    const addToFavorites = await axios.post(
      `http://localhost:8080/toggleFavoriteMedia`,
      {
        sessionId: sessionId,
        mediaType: mediaType,
        mediaId: mediaId,
        userId: userInfo.data.id,
        isFavorited: isFavorite,
      }
    );

    if (addToFavorites.data.success) {
      setIsFavorite(!isFavorite);
    }
  };

  const onFavoriteIconClick = (e) => {
    toggleFavoriteMedia(mediaId, "tv");
  };

  const onWatchClick = (e) => {
    playMedia(e.currentTarget.id, e.currentTarget.classList.contains("tv"));
  };

  const playMedia = () => {
    navigate(`/play/tv/${mediaId}`);
  };

  return (
    mediaInfo && (
      <div className="landingPage">
        <div className='mediaDisplay'>
          <div className="imgAndRatings">
            <img
              src={`https://image.tmdb.org/t/p/original/${
                mediaInfo.poster_path || mediaInfo.backdrop_path
              }`}
              alt="media poster image"
            />
            <div className="ratings">
              <span className="voteAverage">
                {mediaInfo.vote_average.toFixed(1)}
              </span>{" "}
              / <span className="voteCount">{mediaInfo.vote_count} voted</span>
            </div>
          </div>

          <div className="mediaInfoHolder">
            <div className="buttons">
              <button className="watch" onClick={onWatchClick}>
                <img src={playIcon} alt="play icon" /> Watch
              </button>

              <img
                className="favoriteIcon"
                src={isFavorite ? favoriteIcon : notAFavoriteIcon}
                alt="favorite icon"
                onMouseEnter={hoverFavoriteEnter}
                onMouseLeave={hoverFavoriteLeave}
                onClick={onFavoriteIconClick}
              />
            </div>
            <div className="title">
              <strong>{mediaInfo.name}</strong>{" "}
              <span>{mediaInfo.content_ratings.results[0].rating}</span>
            </div>
            <div className="overview">{mediaInfo.overview}</div>
            <div className="group">
              <div className="released">
                <strong>Released: </strong>
                {mediaInfo.first_air_date}
              </div>
              <div className="duration">
                <strong>Duration: </strong>
                {mediaInfo.episode_run_time[0]} min
              </div>
            </div>
            <div className="group">
              <div className="genre">
                <strong>Genre: </strong>
                {extractNames(mediaInfo.genres, mediaInfo.genres.length)}
              </div>
              <div className="country">
                <strong>Country: </strong>
                {mediaInfo.production_countries[0].name}
              </div>
            </div>
            <div className="cast">
              <strong>Cast: </strong>
              {extractNames(mediaInfo.aggregate_credits.cast, 6)}
            </div>
            <div className="production">
              <strong>Production: </strong>
              {extractNames(
                mediaInfo.production_companies,
                mediaInfo.production_companies.length
              )}
            </div>
          </div>
        </div>
        <Recommendations
          recommendations={mediaInfo.recommendations.results}
          amt={5}
        />
      </div>
    )
  );
};

export default TVInfo;
