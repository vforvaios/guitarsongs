const db = require("../services/db");
require("dotenv").config();

const getFavorites = async (req, res, next) => {
  try {
    const [favorites] = await db.query(`
      SELECT
        s.id,
        s.title,
        a.name AS artist_name,
        f.created_at,
        CASE
        WHEN f.song_id IS NOT NULL THEN 1
        ELSE 0
      END AS is_favorite
      FROM FAVORITE_SONGS f
      INNER JOIN SONGS s ON s.id = f.song_id
      LEFT JOIN ARTISTS a ON a.id = s.artist_id
      ORDER BY f.created_at DESC
    `);

    res.status(200).json({
      songs: favorites,
      count: favorites.length,
    });
  } catch (error) {
    res.sendStatus(401);
    next(error);
  }
};

const addFavorite = async (req, res, next) => {
  try {
    const songId = Number(req.params.songId);

    if (!Number.isInteger(songId) || songId <= 0) {
      return res.status(400).json({
        message: "Invalid song ID",
      });
    }

    const [
      result,
    ] = await db.query(
      `INSERT IGNORE INTO FAVORITE_SONGS (song_id) VALUES (?)`,
      [songId],
    );

    if (result.affectedRows === 0) {
      return res.status(200).json({
        message: "Song is already a favorite",
      });
    }

    res.status(201).json({
      message: "Favorite added successfully",
    });
  } catch (error) {
    res.sendStatus(401);
    next(error);
  }
};

const removeFavorite = async (req, res, next) => {
  try {
    const songId = Number(req.params.songId);

    if (!Number.isInteger(songId) || songId <= 0) {
      return res.status(400).json({
        message: "Invalid song ID",
      });
    }

    await db.query(`DELETE FROM FAVORITE_SONGS WHERE song_id = ?`, [songId]);

    res.status(200).json({
      message: "Favorite removed successfully",
    });
  } catch (error) {
    res.sendStatus(401);
    next(error);
  }
};

module.exports = {
  getFavorites,
  addFavorite,
  removeFavorite,
};
