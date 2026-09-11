const db = require("../services/db");
require("dotenv").config();

const getSongById = async (req, res, next) => {
  try {
    const [song] = await db.query(
      `SELECT
            id,
            title,
            content
       FROM SONGS
       WHERE id = ?`,
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
