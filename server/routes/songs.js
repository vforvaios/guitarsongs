const express = require("express");
const Songs = require("../controllers/songs.controller");

const router = express.Router();

// Δημιουργία τραγουδιού
router.post("/", Songs.createSong);

// Αναζήτηση τραγουδιών
router.post("/search", Songs.searchSongs);

// Εύρεση όλων των τραγουδιών για το Admin
router.get("/admin", Songs.getAdminSongs);

// Διαγραφή τραγουδιού
router.delete("/:id", Songs.deleteSong);

// Τραγούδια ανά κατηγορία
router.get("/:categoryId", Songs.getSongsByCategory);

module.exports = router;
