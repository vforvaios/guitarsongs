const db = require("../services/db");

const getSongById = async (req, res, next) => {
  try {
    const { rows } = await db.query(
      `
        SELECT
          s.id,
          s.title,
          s.content,
          s.strumming_pattern,
          a.name AS "artistName",
          CASE
            WHEN f.song_id IS NOT NULL THEN 1
            ELSE 0
          END AS is_favorite
        FROM songs s
        INNER JOIN artists a
          ON a.id = s.artist_id
        LEFT JOIN favorite_songs f
          ON f.song_id = s.id
        WHERE s.id = $1
      `,
      [req.params.songId],
    );

    res.status(200).json({
      song: rows,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getSongById,
};
