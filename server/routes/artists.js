const express = require("express");
const Artists = require("../controllers/artists.controller");

const router = express.Router();

router.get("/", Artists.getArtists);
router.get("/:id/songs", Artists.getArtistsSongsById);

module.exports = router;
