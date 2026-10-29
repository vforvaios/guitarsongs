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

const getArtistsByCategory = async (req, res, next) => {
  try {
    const [artists] = await db.query(`
      SELECT
        c.id AS category_id,
        c.name AS category_name,
        a.id AS artist_id,
        a.name AS artist_name,
        COUNT(DISTINCT s.id) AS song_count
      FROM SONGS_CATEGORIES c
      INNER JOIN SONG_CATEGORIES sc
        ON sc.category_id = c.id
      INNER JOIN SONGS s
        ON s.id = sc.song_id
      INNER JOIN ARTISTS a
        ON a.id = s.artist_id
      GROUP BY
        c.id,
        c.name,
        a.id,
        a.name
      ORDER BY
        c.name ASC,
        a.name ASC
    `);

    return res.status(200).json({
      artists,
      count: artists.length,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getArtists,
  getArtistsSongsById,
  getArtistsByCategory,
};
