import express from "express";
import "dotenv/config";

const app = express();
app.use(express.json());
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

const PORT = 8080;

const bearerOptions = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${process.env.API_READ_KEY}`,
  },
};

app.listen(PORT, async () => {
  console.log("Server Listening On Port 8080");
});

app.get("/createSession", async (req, res) => {
  console.log(req.query.requestToken)
  const url = "https://api.themoviedb.org/3/authentication/session/new";
  const options = {
    method: "POST",
    headers: {
      accept: "application/json",
      "content-type": "application/json",
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJlYmY0ZWI3NzAxMmZlMzAyNDFkNTI5MjllNzM2YzA5NyIsIm5iZiI6MTc0NTczNjU5NS4zNTksInN1YiI6IjY4MGRkMzkzZDgwZmRmODJhN2VhZGI2YSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.d6KmPisJsyube6QyOu6rTpXXjiyg6YlOnYxk7UJJcZg",
    },
    body: JSON.stringify({ request_token: req.query.requestToken }),
  };

  const response = await fetch(url, options);
  const data = await response.json();
  res.status(200).send(data);
});

app.get("/approveSession", async (req, res) => {
  try {
    const tokenResponseURL =
      "https://api.themoviedb.org/3/authentication/token/new";
    const tokenResponse = await fetch(tokenResponseURL, bearerOptions);
    const tokenData = await tokenResponse.json();

    res.status(200).json(tokenData);
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: "Failed to create session" });
  }
});

app.post("/getMovieInfo", async (req, res) => {
  try {
    const mediaId = req.body.mediaId;
    const url = `https://api.themoviedb.org/3/movie/${mediaId}?language=en-US&append_to_response=reviews,recommendations,similar`;

    const response = await fetch(url, bearerOptions);
    let data = await response.json();

    res.status(200).send(data);
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: "Failed to fetch media data" });
  }
});

app.post("/getShowInfo", async (req, res) => {
  try {
    const mediaId = req.body.mediaId;
    const url = `https://api.themoviedb.org/3/tv/${mediaId}?language=en-US&append_to_response=content_ratings,recommendations,similar,aggregate_credits`;

    const response = await fetch(url, bearerOptions);
    let data = await response.json();

    res.status(200).send(data);
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: "Failed to fetch media data" });
  }
});

app.post("/searchMedia", async (req, res) => {
  try {
    const query = req.body.query;
    const url = `https://api.themoviedb.org/3/search/multi?query=${encodeURIComponent(
      query
    )}&include_adult=false&language=en-US&page=1`;

    const response = await fetch(url, bearerOptions);
    let data = await response.json();
    data = data.results.filter((elem) => elem.media_type != "person");

    // I want to ignore glitched searches that happen in certain cases
    data = data.filter((elem) => elem.release_date != "");
    data = data.filter(
      (elem) => elem.backdrop_path != null || elem.poster_path != null
    );

    const compare = (a, b) => {
      return b.popularity - a.popularity;
    };
    data.sort(compare);
    res.send(data);
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: "Failed to fetch media data" });
  }
});
