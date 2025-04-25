import React from "react";
import { gql, useLazyQuery } from "@apollo/client";
import "./AddAnime.css";
import homeLogo from "../../assets/home.png";

const AddAnime = () => {
  const handleTextChange = (e) => {
    if (e.key === "Enter") {
      const searchTerm = e.target.value;
      if (searchTerm.trim()) {
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

  const listAnime = (anime) => {
    return (
      <div key={anime.title.english} className="anime">
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
    <>
      <div className="search">
        <div className="inputAndHome">
          <input type="text" onKeyDown={handleTextChange} />
          <a href="/">
            <img src={homeLogo} alt="Home Logo" />
          </a>
        </div>
        {loading && <p>Loading...</p>}
        {error && <p>Error: {error.message}</p>}
        {data?.Page?.media.map((anime) => listAnime(anime))}
      </div>
    </>
  );
};

export default AddAnime;
