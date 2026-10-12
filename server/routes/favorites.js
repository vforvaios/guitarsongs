const express = require("express");
const router = express.Router();

const Favorites = require("../controllers/favorites.controller");

router.get("/", Favorites.getFavorites);
router.post("/:songId", Favorites.addFavorite);
router.delete("/:songId", Favorites.removeFavorite);

module.exports = router;
