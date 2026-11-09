const express = require("express");
const verifyToken = require("../utils/verifyToken");

const Artists = require("../controllers/artists.controller");

const router = express.Router();

router.get("/", Artists.getArtists);
router.post("/", [verifyToken], Artists.createArtists);
router.put("/:id", [verifyToken], Artists.updateArtist);
router.delete("/:id", [verifyToken], Artists.deleteArtist);
router.get("/:id/songs", Artists.getArtistsSongsById);
router.get("/by-category", Artists.getArtistsByCategory);

module.exports = router;
