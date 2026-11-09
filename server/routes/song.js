const express = require("express");
const verifyToken = require("../utils/verifyToken");
const Song = require("../controllers/song.controller");

const router = express.Router();

router.get("/:songId", Song.getSongById);
router.put("/:songId", [verifyToken], Song.updateSong);
router.delete("/:songId", [verifyToken], Song.deleteSong);

module.exports = router;
