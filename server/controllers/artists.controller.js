const db = require("../services/db");

const getArtists = async (req, res, next) => {
  try {
    const { rows: artists } = await db.query(`
      SELECT DISTINCT
        a.id,
        a.name
      FROM artists a
      ORDER BY a.name;
    `);

    res.status(200).json({
      artists,
    });
  } catch (error) {
    next(error);
  }
};

const getArtistsSongsById = async (req, res, next) => {
  try {
    const { rows: artistSongs } = await db.query(
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
      FROM songs s
      INNER JOIN artists art
        ON art.id = s.artist_id
      LEFT JOIN favorite_songs f
        ON f.song_id = s.id
      WHERE art.id = $1
      ORDER BY s.title
      `,
      [req.params.id],
    );

    res.status(200).json({
      artistSongs,
    });
  } catch (error) {
    next(error);
  }
};

const getArtistsByCategory = async (req, res, next) => {
  try {
    const { rows: artists } = await db.query(`
      SELECT
        c.id AS category_id,
        c.name AS category_name,
        a.id AS artist_id,
        a.name AS artist_name,
        COUNT(DISTINCT s.id) AS song_count
      FROM songs_categories c
      INNER JOIN song_categories sc
        ON sc.category_id = c.id
      INNER JOIN songs s
        ON s.id = sc.song_id
      INNER JOIN artists a
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
