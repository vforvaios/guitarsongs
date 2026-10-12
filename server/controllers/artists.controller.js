const db = require("../services/db");
require("dotenv").config();

const getArtists = async (req, res, next) => {
  try {
    const [artists] = await db.query(
      `
      SELECT DISTINCT
        a.id,
        a.name
      FROM ARTISTS a
      ORDER BY a.name;
      `,
    );

    res.status(200).json({
      artists,
    });
  } catch (error) {
    res.sendStatus(401);
    next(error);
  }
};

const getArtistsSongsById = async (req, res, next) => {
  try {
    const [artistSongs] = await db.query(
      `
      SELECT
      s.id,
      s.title,
      s.artist_id,
      art.name AS artist_name,
      CASE
          WHEN f.song_id IS NOT NULL THEN 1
          ELSE 0
        END AS is_favorite
    FROM SONGS s
    INNER JOIN ARTISTS art
      ON art.id = s.artist_id
    LEFT JOIN FAVORITE_SONGS f
      ON f.song_id = s.id
    WHERE art.id = ?
    ORDER BY s.title
      `,
      [req.params.id],
    );

    res.status(200).json({
      artistSongs,
    });
  } catch (error) {
    res.sendStatus(401);
    next(error);
  }
};

module.exports = {
  getArtists,
  getArtistsSongsById,
};
