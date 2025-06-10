import express from "express";
import "dotenv/config";
import axios from "axios";
import { MongoClient, ServerApiVersion } from "mongodb";

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
const apiKey = process.env.API_KEY;
const uri = process.env.MONGODB_URI;

let client;
let collection;

async function connectToMongo() {
  if (!client) {
    client = new MongoClient(uri, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      },
    });
    await client.connect();
    const db = client.db("mediaTracker");
    collection = db.collection("watchedEpisodes");
  }
}

async function getWatchedEpisodesForShow(mediaId) {
  await connectToMongo();
  const database = client.db("mediaTracker");
  const collection = database.collection("watchedEpisodes");
  const query = { mediaId };
  const watchedEpisodes = await collection.findOne(query);

  return watchedEpisodes;
}

async function removeFromWatchedEpisodes(mediaId, season, episode) {
  await connectToMongo();
  const database = client.db("mediaTracker");
  const collection = database.collection("watchedEpisodes");
  const query = { mediaId };
  const watchedEpisodes = await collection.findOne(query);

  if (watchedEpisodes !== null) {
    const seasons = watchedEpisodes["seasons"];
    const seasonList = seasons.find((elem) => elem.season == season);
    if (seasonList) {
      const episodes = seasonList["watchedEpisodes"];
      const elements = new Set(episodes);
      elements.delete(episode);
      const uniqueElements = [...elements];
      seasonList["watchedEpisodes"] = uniqueElements;
    }

    await collection.updateOne(
      { mediaId },
      { $set: { seasons: seasons, lastWatch: { episode, season } } }
    );
  }
}

async function addToWatchedEpisodes(mediaId, season, episode) {
  await connectToMongo();
  const database = client.db("mediaTracker");
  const collection = database.collection("watchedEpisodes");
  const query = { mediaId };
  const watchedEpisodes = await collection.findOne(query);

  if (watchedEpisodes !== null) {
    const seasons = watchedEpisodes["seasons"];
    const seasonList = seasons.find((elem) => elem.season == season);
    if (seasonList) {
      const episodes = seasonList["watchedEpisodes"];
      episodes.push(episode);
      const uniqueElements = [...new Set(episodes)];
      seasonList["watchedEpisodes"] = uniqueElements;
    } else {
      seasons.push({ season: season, watchedEpisodes: [episode] });
    }

    await collection.updateOne(
      { mediaId },
      { $set: { seasons: seasons, lastWatch: { episode, season } } }
    );
  } else {
    const schema = {
      mediaId,
      lastWatch: { episode, season },
      seasons: [{ season: season, watchedEpisodes: [episode] }],
    };
    await collection.insertOne(schema);
  }
}

app.listen(PORT, async () => {
  console.log("Server Listening On Port 8080");
});

app.post("/getWatchedEpisodes", async (req, res) => {
  const response = await getWatchedEpisodesForShow(req.body.mediaId);
  res.send(response);
});

app.post("/addToWatched", async (req, res) => {
  const { mediaId, season, episode } = req.body;
  const response = await addToWatchedEpisodes(mediaId, season, episode);
  res.send(response);
});

app.post("/removeFromWatched", async (req, res) => {
  const { mediaId, season, episode } = req.body;
  const response = await removeFromWatchedEpisodes(mediaId, season, episode);
  res.send(response);
});

app.post("/getSeasonInfo", async (req, res) => {
  const url = `https://api.themoviedb.org/3/tv/${req.body.mediaId}/season/${req.body.seasonNumber}?api_key=${apiKey}`;
  const response = await axios.get(url);
  res.send(response.data);
});

app.post("/toggleFavoriteMedia", async (req, res) => {
  const url = `https://api.themoviedb.org/3/account/${req.body.userId}/favorite?api_key=${apiKey}&session_id=${req.body.sessionId}`;
  const body = {
    media_type: req.body.mediaType,
    media_id: req.body.mediaId,
    favorite: !req.body.isFavorited,
  };
  const response = await axios.post(url, body);
  res.send(response.data);
});

app.post("/getFavoriteMovies", async (req, res) => {
  const url = `https://api.themoviedb.org/3/account/${req.body.id}/favorite/movies?api_key=${apiKey}&session_id=${req.body.sessionId}`;
  const response = await axios.get(url);
  res.send(response.data);
});

app.post("/getFavoriteTV", async (req, res) => {
  console.log(apiKey);
  const url = `https://api.themoviedb.org/3/account/${req.body.id}/favorite/tv?api_key=${apiKey}&session_id=${req.body.sessionId}`;
  const response = await axios.get(url);
  res.send(response.data);
});

app.post("/getAccountInfo", async (req, res) => {
  const url = `https://api.themoviedb.org/3/account?api_key=${apiKey}&session_id=${req.body.sessionId}`;
  const response = await axios.get(url);
  res.send(response.data);
});

app.post("/logout", async (req, res) => {
  const url = `https://api.themoviedb.org/3/authentication/session`
  const options = {
    method: "DELETE",
    headers: {
      accept: "application/json",
      "content-type": "application/json",
      Authorization:
        `Bearer ${process.env.API_READ_KEY}`
    },
    body: JSON.stringify({ session_id: req.body.sessionId })
  };

  const response = await fetch(url, options)
  res.send(response);
});

app.get("/createSession", async (req, res) => {
  const url = `https://api.themoviedb.org/3/authentication/session/new?api_key=${apiKey}`;
  const body = { request_token: req.query.requestToken };
  const response = await axios.post(url, body);
  res.send(response.data);
});

app.get("/approveSession", async (req, res) => {
  try {
    const url = `https://api.themoviedb.org/3/authentication/token/new?api_key=${apiKey}`;
    const response = await axios.get(url);
    res.send(response.data);
  } catch (err) {
    res.status(500).send({ error: "Failed to create session" });
  }
});

app.post("/getMovieInfo", async (req, res) => {
  try {
    const { sessionId, mediaId } = req.body;
    const url = `https://api.themoviedb.org/3/movie/${mediaId}?api_key=${apiKey}&session_id=${sessionId}&language=en-US&append_to_response=reviews,recommendations,credits,account_states,release_dates`;
    const response = await axios.get(url);
    res.send(response.data);
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: "Failed to fetch media data" });
  }
});

app.post("/getShowInfo", async (req, res) => {
  try {
    const { sessionId, mediaId } = req.body;
    const url = `https://api.themoviedb.org/3/tv/${mediaId}?api_key=${apiKey}&session_id=${sessionId}&language=en-US&append_to_response=content_ratings,recommendations,aggregate_credits,account_states`;
    const response = await axios.get(url);
    res.send(response.data);
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: "Failed to fetch media data" });
  }
});

app.post("/searchMedia", async (req, res) => {
  try {
    const query = req.body.query;
    const url = `https://api.themoviedb.org/3/search/multi?api_key=${apiKey}&query=${encodeURIComponent(
      query
    )}&include_adult=false&language=en-US&page=1`;

    const response = await axios.get(url);
    let data = response.data;
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
