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
            a.name as artistName
       FROM SONGS s
       INNER JOIN ARTISTS a on a.id = s.artist_id
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
