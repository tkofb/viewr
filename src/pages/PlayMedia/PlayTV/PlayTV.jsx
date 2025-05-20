import React, { useEffect, useState } from "react";
import axios from "axios";
import "./PlayTV.css";

const PlayTV = ({ mediaId }) => {
  const [mediaInfo, setMediaInfo] = useState();
  const [seasonInfo, setSeasonInfo] = useState();
  const [currSeason, setCurrSeason] = useState(0);
  const [currEpisode, setCurrEpisode] = useState(0);

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
      for (let i = 0; i < mediaInfo.number_of_seasons; i++) {
        const seasonInfo = await getSeasonInfo(i);
        seasonInfoList.push(seasonInfo);
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
      setCurrSeason(newSeason - 1);
      setCurrEpisode(0);
    }
  };

  const handleClickedEpisode = (e) => {
    const match = e.currentTarget.id.match(/\d+/);

    if (match) {
      const newEpisode = parseInt(match[0], 10);
      setCurrEpisode(newEpisode - 1);
    }
  };

  const displayLandingPage = () => {
    return (
      <div className="seasonsHolder">
        {seasonInfo.map((elem) => {
          const isActive = elem.season_number - 1 === currSeason;

          return (
            <div
              className={`season ${isActive ? 'active' : ''}`}
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
          );
        })}
      </div>
    );
  };

  const displayEpisodesForSeason = () => {
    const currSeasonInfo = seasonInfo[currSeason]["episodes"];
    console.log(currSeasonInfo);

    return (
      <div className="episodeButtonsHolder">
        {currSeasonInfo.map((elem) => {
          const isActive = elem.episode_number - 1 === currEpisode;

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

  return (
    seasonInfo && (
      <div className="landingPage">
        {displayLandingPage()}
        {displayEpisodesForSeason()}
      </div>
    )
  );
};

export default PlayTV;
