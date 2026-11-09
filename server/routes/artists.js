const express = require("express");
const Artists = require("../controllers/artists.controller");

const router = express.Router();

router.get("/", Artists.getArtists);
router.post("/", Artists.createArtists);
router.put("/:id", Artists.updateArtist);
router.delete("/:id", Artists.deleteArtist);
router.get("/:id/songs", Artists.getArtistsSongsById);
router.get("/by-category", Artists.getArtistsByCategory);

module.exports = router;
