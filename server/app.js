const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

const errorHandler = require("./errors/errorHandler");

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(
  cors({
    origin: [
      "https://guitarsongs.vercel.app",
      "http://localhost:5173",
      "http://test-1.domain.gr:5173",
      "http://test-2.domain.gr:5173",
      "https://quickpage-orxo.vercel.app",
      "http://quickpage-orxo.domain.gr:5173",
    ],
  }),
);

// routes
// const productsRoute = require("./routes/products");
const loginRoute = require("./routes/login");
const registerRoute = require("./routes/register");
const categoriesRoute = require("./routes/categories");
const songsRoute = require("./routes/songs");
const songRoute = require("./routes/song");
const artistsRoute = require("./routes/artists");

// app.use("/api/products", productsRoute);
app.use("/api/login", loginRoute);
app.use("/api/register", registerRoute);
app.use("/api/categories", categoriesRoute);
app.use("/api/songs", songsRoute);
app.use("/api/song", songRoute);
app.use("/api/artists", artistsRoute);

app.use(errorHandler);

// initial routes
app.get("/", (req, res) => {
  res.send(
    "Express is on the way and listening dude....Give me some api routes to resolve! Bit bucket on the run!!!!!!!!",
  );
});

app.get("/api", (req, res) => {
  res.send("Api route");
});

module.exports = app;
