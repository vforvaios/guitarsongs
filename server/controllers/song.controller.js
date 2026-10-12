const db = require("../services/db");
require("dotenv").config();

const getSongById = async (req, res, next) => {
  try {
    const [song] = await db.query(
      `SELECT
            s.id,
            s.title,
            s.content,
            s.strumming_pattern,
            a.name as artistName,
            CASE
              WHEN f.song_id IS NOT NULL THEN 1
              ELSE 0
            END AS is_favorite
       FROM SONGS s
       INNER JOIN ARTISTS a on a.id = s.artist_id
      LEFT JOIN FAVORITE_SONGS f
       ON f.song_id = s.id
      WHERE s.id = ?`,
      [req.params.songId],
    );

    res.status(200).json({ song });
  } catch (error) {
    res.sendStatus(401);
    next(error);
  }
};

module.exports = {
  getSongById,
};
