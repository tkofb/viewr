import React, { useState } from "react";
import { gql, useLazyQuery } from "@apollo/client";
import "./AddAnime.css";
import homeLogo from "../../assets/home.png";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AddAnime = () => {
  const navigate = useNavigate();
  const [mediaList, setMediaList] = useState([]);

  const playAnime = (animeName) => {
    navigate("/anime", {
      state: { animeName: animeName },
    });
  };

  const handleTextChange = async (e) => {
    if (e.key === "Enter") {
      const searchTerm = e.target.value.trim();
      if (searchTerm) {
        const response = await axios.post(`http://localhost:8080/searchMedia`, {
          query: searchTerm,
        });

        setMediaList(response.data);
        console.log(response.data);
        fetchAnime({ variables: { search: searchTerm } });
      }
    }
  };

  const tvOrMovie = (str) => {
    if (str === "MOVIE") {
      return "Movie";
    }

    return str;
  };

  const numToMonth = (num) => {
    return Intl.DateTimeFormat("en", { month: "short" }).format(new Date(num)); // January
  };

  const description = (desc) => {
    if (desc.length >= 540) {
      return desc.slice(0, 540) + "...";
    }

    return desc;
  };

  const onClick = (e) => {
    playAnime(e.currentTarget.id);
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
        id={media.name}
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

  const listAnime = (anime) => {
    return (
      <div
        key={anime.title.english}
        id={anime.title.english}
        className="anime"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={onClick}
      >
        <img src={anime.coverImage.large} alt="anime cover" />
        <div className="text">
          <h2>{anime.title.english || anime.title.romaji}</h2>
          {/* Removes the div elements that are for some reason included as strings like <div> */}
          <p>{description(anime.description.replace(/<\/?[^>]+(>|$)/g, ""))}</p>
          <div className="details">
            <p>{tvOrMovie(anime.format)}</p>
            <p>{anime.duration}m</p>
            <p>
              {numToMonth(anime.startDate.month)} {anime.startDate.day},{" "}
              {anime.startDate.year}
            </p>
            {anime.format === "TV" && <p>{anime.episodes} EP</p>}
          </div>
        </div>
      </div>
    );
  };

  const SEARCH_ANIME_LIST = gql`
    query ($search: String) {
      Page(perPage: 5) {
        media(
          search: $search
          type: ANIME
          isAdult: false
          sort: [POPULARITY_DESC, SEARCH_MATCH]
        ) {
          id
          title {
            romaji
            english
          }
          coverImage {
            large
          }
          description(asHtml: false)
          format
          episodes
          duration
          startDate {
            year
            month
            day
          }
          staff {
            edges {
              role
              node {
                id
                name {
                  full
                  native
                }
                language
                image {
                  large
                }
              }
            }
          }
        }
      }
    }
  `;

  const [fetchAnime, { loading, error, data }] =
    useLazyQuery(SEARCH_ANIME_LIST);

  return (
    <div className="search">
      <div className="inputAndHome">
        <input type="text" onKeyDown={handleTextChange} />
        <a href="/">
          <img src={homeLogo} alt="Home Logo" />
        </a>
      </div>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error.message}</p>}
      {data && (
        <div className="animeList">
          {mediaList.map((media) => listMedia(media))}
          {data?.Page?.media.map((anime) => listAnime(anime))}
        </div>
      )}
    </div>
  );
};

export default AddAnime;
