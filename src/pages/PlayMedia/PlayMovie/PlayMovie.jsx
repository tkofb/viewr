import axios from "axios";
import React, { useEffect, useState } from "react";
import notAFavoriteIcon from "../../../assets/notAFavorite.svg";
import favoriteIcon from "../../../assets/favorite.svg";
import playIcon from "../../../assets/play.svg";
import "./PlayMovie.css";

const PlayMovie = ({ mediaId }) => {
  const [mediaInfo, setMediaInfo] = useState();
  const sessionId = localStorage.getItem("sessionId");
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const getMovieInfo = async () => {
      const response = await axios.post(`http://localhost:8080/getMovieInfo`, {
        mediaId: mediaId,
        sessionId: sessionId,
      });
      setMediaInfo(response.data);
      setIsFavorite(response.data.account_states.favorite);
    };

    getMovieInfo();
  }, [mediaId]);

  function MovieEmbed({ lang = "en" }) {
    const src = `https://vidsrc.xyz/embed/movie?tmdb=${mediaId}&ds_lang=${lang}`;

    return <iframe src={src} allow="fullscreen" />;
  }

  const getRatings = (releaseDatesWorldwide) => {
    return releaseDatesWorldwide.find((elem) => elem.iso_3166_1 == "US")
      .release_dates[0].certification;
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

  const onClick = (e) => {
    toggleFavoriteMedia(mediaId, "movie");
  };

  const extractNames = (lst, amt) => {
    return lst
      .slice(0, amt)
      .reduce((accum, currValue) => accum + `${currValue.name}, `, "")
      .slice(0, -2);
  };
  return (
    <div className="landingPage">
      <MovieEmbed mediaId={mediaId} />
      {mediaInfo && (
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
            <div className="titleAndFavorites">
              <div className="title">
                <strong>{mediaInfo.title}</strong>{" "}
                <span>{getRatings(mediaInfo.release_dates.results)}</span>
              </div>
              <div className="buttons">
                <img
                  className="favoriteIcon"
                  src={isFavorite ? favoriteIcon : notAFavoriteIcon}
                  alt="favorite icon"
                  onMouseEnter={hoverFavoriteEnter}
                  onMouseLeave={hoverFavoriteLeave}
                  onClick={onClick}
                />
              </div>
            </div>
            <div className="overview">{mediaInfo.overview}</div>
            <div className="group">
              <div className="released">
                <strong>Released: </strong>
                {mediaInfo.release_date}
              </div>
              <div className="duration">
                <strong>Duration: </strong>
                {mediaInfo.runtime} min
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
              {extractNames(mediaInfo.credits.cast, 6)}
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
      )}
    </div>
  );
};

export default PlayMovie;
