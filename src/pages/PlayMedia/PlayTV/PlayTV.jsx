import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import "./PlayTV.css";
import notReleasedLogo from "../../../assets/notReleasedLogo.png";

const PlayTV = ({ mediaId }) => {
  const [mediaInfo, setMediaInfo] = useState();
  const [seasonInfo, setSeasonInfo] = useState();
  const [currSeason, setCurrSeason] = useState(1);
  const [currEpisode, setCurrEpisode] = useState(1);

  const sessionId = localStorage.getItem("sessionId");

  useEffect(() => {
    const getShowInfo = async () => {
      const response = await axios.post(`http://localhost:8080/getShowInfo`, {
        mediaId: mediaId,
        sessionId: sessionId,
      });

      setMediaInfo(response.data);
    };

    getShowInfo();
  }, [mediaId]);

  useEffect(() => {
    const getSeasonInfo = async (seasonNumber) => {
      const response = await axios.post(`http://localhost:8080/getSeasonInfo`, {
        mediaId: mediaId,
        seasonNumber: seasonNumber,
      });

      return response.data;
    };

    const assignIndexToSeason = async () => {
      const seasonInfoList = [];
      for (let i = 0; i <= mediaInfo.number_of_seasons; i++) {
        try {
          const seasonInfo = await getSeasonInfo(i);
          seasonInfoList.push(seasonInfo);
        } catch {
          seasonInfoList.push({ seasonNumber: i });
        }
      }
      seasonInfoList.sort((a, b) => a.season_number - b.season_number);

      setSeasonInfo(seasonInfoList);
    };

    if (mediaInfo) {
      assignIndexToSeason();
    }
  }, [mediaInfo]);

  const addToWatched = async (season, episode) => {
    const response = await axios.post(`http://localhost:8080/addToWatched`, {
      mediaId,
      season,
      episode,
    });

    return response.data;
  };

  const handleClickedSeason = (e) => {
    const match = e.currentTarget.id.match(/\d+/);

    if (match) {
      const newSeason = parseInt(match[0], 10);
      setCurrSeason(newSeason);
      setCurrEpisode(1);
    }
  };

  const handleClickedEpisode = (e) => {
    const match = e.currentTarget.id.match(/\d+/);

    if (match) {
      const newEpisode = parseInt(match[0], 10);
      setCurrEpisode(newEpisode);
    }
  };

  const displaySeasons = () => {
    return (
      <div className="seasonsHolder">
        {seasonInfo.map((elem) => {
          const isActive = elem.season_number === currSeason;

          return elem.season_number != undefined && elem.season_number != 0 ? (
            <div
              className={`season ${isActive ? "active" : ""}`}
              id={`season${elem.season_number}`}
              style={{
                backgroundImage:
                  "url(" +
                  `https://image.tmdb.org/t/p/original/${elem.poster_path}` +
                  ")",
              }}
              onClick={handleClickedSeason}
            >
              <span>{elem.name}</span>
            </div>
          ) : (
            <></>
          );
        })}
      </div>
    );
  };

  const displayEpisodesForSeason = () => {
    const currSeasonEpisodes = seasonInfo[currSeason]["episodes"];

    return (
      <div className="episodeButtonsHolder">
        {currSeasonEpisodes.map((elem) => {
          const isActive = elem.episode_number === currEpisode;
          const released = isReleased(elem.air_date);

          return (
            <button
              className={`episodeButton ${!released && "notReleased"} ${
                isActive && "active"
              } `}
              id={`episode${elem.episode_number}`}
              onClick={handleClickedEpisode}
            >
              {elem.episode_number}
            </button>
          );
        })}
      </div>
    );
  };

  const [startTime, setStartTime] = useState(null);

  useEffect(() => {
    const handleTimeDifference = () => {
      if (seasonInfo && startTime) {
        const episodeInfo = seasonInfo[currSeason]["episodes"][currEpisode - 1];
        const released = isReleased(episodeInfo.air_date);

        if (released) {
          const currTime = new Date();
          const seconds = (currTime.getTime() - startTime.getTime()) / 1000;
          const episodeLength = episodeInfo.runtime * 60;
          const progression = seconds / episodeLength;
          console.log(progression);
        }
      }
    };

    const interval = setInterval(handleTimeDifference, 1000);

    return () => clearInterval(interval);
  }, [seasonInfo, startTime]);

  const displayEpisodeInformation = () => {
    const episodeInfo = seasonInfo[currSeason]["episodes"][currEpisode - 1];
    const released = isReleased(
      seasonInfo[currSeason]["episodes"][currEpisode - 1].air_date
    );

    return (
      <div className="mediaDisplay">
        <div className="imgAndRatings">
          {released ? (
            <>
              <img
                src={`https://image.tmdb.org/t/p/original/${
                  episodeInfo.still_path ||
                  mediaInfo.poster_path ||
                  mediaInfo.backdrop_path
                }`}
                alt="media poster image"
              />
              <div className="ratings">
                <span className="voteAverage">
                  {episodeInfo.vote_average.toFixed(1)}
                </span>{" "}
                /{" "}
                <span className="voteCount">
                  {episodeInfo.vote_count} voted
                </span>
              </div>
            </>
          ) : (
            <img
              className="notReleasedLogo"
              src={notReleasedLogo}
              alt="Not Released Logo"
            />
          )}
        </div>

        <div className="mediaInfoHolder playTV">
          <div className="title">
            <strong>{episodeInfo.name}</strong>{" "}
            <span>{mediaInfo.content_ratings.results[0].rating}</span>
          </div>

          {episodeInfo.overview && (
            <div className="overview">{episodeInfo.overview}</div>
          )}

          {(episodeInfo.runtime || episodeInfo.air_date) && (
            <div className="group">
              {episodeInfo.air_date && isReleased(episodeInfo.air_date) ? (
                <div className="released">
                  <strong>Released: </strong>
                  {episodeInfo.air_date}
                </div>
              ) : (
                episodeInfo.air_date != undefined && (
                  <div className="released">
                    <strong>Release Date: </strong>
                    {episodeInfo.air_date}
                  </div>
                )
              )}

              {episodeInfo.runtime && (
                <div className="duration">
                  <strong>Duration: </strong>
                  {episodeInfo.runtime} min
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  const [showOverlay, setShowOverlay] = useState(true);

  useEffect(() => {
    setShowOverlay(true);
    setStartTime(null);
    addToWatched(currSeason, currEpisode)
  }, [currSeason, currEpisode]);

  function TvEpisodeEmbed({
    mediaId,
    showOverlay,
    setShowOverlay,
    season,
    episode,
    lang = "en",
  }) {
    const src = `https://vidsrc.xyz/embed/tv?tmdb=${mediaId}&season=${season}&episode=${episode}&ds_lang=${lang}`;

    const handleClick = () => {
      setShowOverlay(false);
      setStartTime(new Date());
    };

    return (
      <div className="iframeHolder">
        {showOverlay && <div onClick={handleClick} className="overlay" />}
        <iframe
          src={src}
          allow="fullscreen"
          title={`Episode ${season}-${episode}`}
        />
      </div>
    );
  }

  const isReleased = (date) => {
    if (!date) {
      return false;
    }

    const releaseDate = new Date(date);
    const today = new Date();

    return releaseDate < today;
  };

  return (
    seasonInfo && (
      <div className="landingPage">
        {isReleased(
          seasonInfo[currSeason]["episodes"][currEpisode - 1].air_date
        ) && (
          <>
            <div>
              Season {currSeason} Episode {currEpisode}:{" "}
              {seasonInfo[currSeason]["episodes"][currEpisode - 1].name}
            </div>
            <TvEpisodeEmbed
              mediaId={mediaId}
              season={currSeason}
              episode={currEpisode}
              showOverlay={showOverlay}
              setShowOverlay={setShowOverlay}
            />
          </>
        )}
        {displayEpisodeInformation()}

        <div className="seasonsAndEpisodes">
          {displaySeasons()}
          {displayEpisodesForSeason()}
        </div>
      </div>
    )
  );
};

export default PlayTV;
