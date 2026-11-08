const express = require("express");
const Songs = require("../controllers/songs.controller");

const router = express.Router();

router.post("/", Songs.createSong);
router.post("/search", Songs.searchSongs);
router.get("/:categoryId", Songs.getSongsByCategory);

module.exports = router;
