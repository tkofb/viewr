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
  console.log("server listening on port 8080");
});

app.post("/searchMedia", async (req, res) => {
  try {
    const query = req.body.query;
    const url = `https://api.themoviedb.org/3/search/multi?query=${encodeURIComponent(
      query
    )}&include_adult=false&language=en-US&page=1`;

    const response = await fetch(url, bearerOptions);
    let data = await response.json();
    data = data.results.filter((elem) => elem.media_type != 'person')

    // I want to ignore glitched searches that happen in certain cases
    data = data.filter((elem) => elem.release_date != "")
    data = data.filter((elem) => elem.backdrop_path != null || elem.poster_path != null)
    
    const compare = (a, b) => {
      return b.popularity  - a.popularity
    }
    data.sort(compare)
    res.send(data)
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: "Failed to fetch media data" });
  }
});
