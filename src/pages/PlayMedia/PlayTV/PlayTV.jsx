import React, { useEffect, useState } from "react";
import axios from "axios";
import "./PlayTV.css";

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
          console.log(`Season ${i} Not Found`);
          seasonInfoList.push({ seasonNumber: i });
        }
      }
      seasonInfoList.sort((a, b) => a.season_number - b.season_number);

      console.log(seasonInfoList);
      setSeasonInfo(seasonInfoList);
    };

    if (mediaInfo) {
      assignIndexToSeason();
    }
  }, [mediaInfo]);

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

  const displayLandingPage = () => {
    return (
      <div className="seasonsHolder">
        {seasonInfo.map((elem) => {
          console.log(elem);

          const isActive = elem.season_number === currSeason;

          return elem.season_number != undefined ? (
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
    const currSeasonInfo = seasonInfo[currSeason]["episodes"];

    return (
      <div className="episodeButtonsHolder">
        {currSeasonInfo.map((elem) => {
          const isActive = elem.episode_number === currEpisode;

          return (
            <button
              className={`episodeButton ${isActive ? "active" : ""}`}
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

  const displayEpisodeInformation = () => {
    console.log(`Season: ${currSeason}, Episode ${currEpisode}`);
    const episodeInfo = seasonInfo[currSeason]["episodes"][currEpisode - 1];
    console.log(episodeInfo.name);

    return (
      <div className="mediaDisplay">
        <div className="imgAndRatings">
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
            / <span className="voteCount">{episodeInfo.vote_count} voted</span>
          </div>
        </div>

        <div className="mediaInfoHolder">
          <div className="title">
            <strong>{episodeInfo.name}</strong>{" "}
            <span>{mediaInfo.content_ratings.results[0].rating}</span>
          </div>
          <div className="overview">{episodeInfo.overview}</div>
          <div className="group">
            <div className="released">
              <strong>Released: </strong>
              {episodeInfo.air_date}
            </div>
            <div className="duration">
              <strong>Duration: </strong>
              {episodeInfo.runtime} min
            </div>
          </div>
        </div>
      </div>
    );
  };

  function TvEpisodeEmbed({ mediaId, season, episode, lang = "en" }) {
    const src = `https://vidsrc.xyz/embed/tv?tmdb=${mediaId}&season=${season}&episode=${episode}&ds_lang=${lang}`;

    return (
      <iframe
        src={src}
        allow="fullscreen"
        title={`Episode ${season}-${episode}`}
      />
    );
  }

  // Example usage:

  return (
    seasonInfo && (
      <div className="landingPage">
        <TvEpisodeEmbed
          mediaId={mediaId}
          season={currSeason}
          episode={currEpisode}
        />

        {displayLandingPage()}
        {displayEpisodeInformation()}
        {displayEpisodesForSeason()}
      </div>
    )
  );
};

export default PlayTV;
