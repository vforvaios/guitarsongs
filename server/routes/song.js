const express = require("express");
const Song = require("../controllers/song.controller");

const router = express.Router();

router.get("/:songId", Song.getSongById);
router.put("/:songId", Song.updateSong);
router.delete("/:songId", Song.deleteSong);

module.exports = router;
