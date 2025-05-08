import React, { useState, useEffect } from "react";
import "./PlayShow.css";
import axios from "axios";
import Recommendations from "../Recommendations/Recommendations";

const PlayShow = ({ mediaId }) => {
  const [mediaInfo, setMediaInfo] = useState();

  const getShowInfo = async () => {
    const response = await axios.post(`http://localhost:8080/getShowInfo`, {
      mediaId: mediaId,
    });

    setMediaInfo(response.data);
  };

  useEffect(() => {
    getShowInfo();
  }, [mediaId]);

  const extractNames = (lst, amt) => {
    return lst
      .slice(0, amt)
      .reduce((accum, currValue) => accum + `${currValue.name}, `, "")
      .slice(0, -2);
  };

  return (
    mediaInfo && (
      <div className="landingPage">
        <div className="mediaDisplay">
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
              <button className="watch">watch now</button>
              <button className="addToFavorites">add to favorities</button>
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

export default PlayShow;
