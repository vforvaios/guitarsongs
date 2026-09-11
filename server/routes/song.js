const express = require("express");
const Song = require("../controllers/song.controller");

const router = express.Router();

router.get("/:songId", Song.getSongById);

module.exports = router;
