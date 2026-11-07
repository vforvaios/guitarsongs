const db = require("../services/db");

const getFavorites = async (req, res, next) => {
  try {
    const { rows: favorites } = await db.query(`
      SELECT
        s.id,
        s.title,
        a.name AS artist_name,
        f.created_at,
        CASE
          WHEN f.song_id IS NOT NULL THEN 1
          ELSE 0
        END AS is_favorite
      FROM favorite_songs f
      INNER JOIN songs s ON s.id = f.song_id
      LEFT JOIN artists a ON a.id = s.artist_id
      ORDER BY f.created_at DESC
    `);

    res.status(200).json({
      songs: favorites,
      count: favorites.length,
    });
  } catch (error) {
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

    const result = await db.query(
      `
        INSERT INTO favorite_songs (song_id)
        VALUES ($1)
        ON CONFLICT (song_id) DO NOTHING
      `,
      [songId],
    );

    if (result.rowCount === 0) {
      return res.status(200).json({
        message: "Song is already a favorite",
      });
    }

    res.status(201).json({
      message: "Favorite added successfully",
    });
  } catch (error) {
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

    await db.query(`DELETE FROM favorite_songs WHERE song_id = $1`, [songId]);

    res.status(200).json({
      message: "Favorite removed successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getFavorites,
  addFavorite,
  removeFavorite,
};
