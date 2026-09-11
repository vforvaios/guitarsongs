const db = require("../services/db");
require("dotenv").config();

const getSongsByCategory = async (req, res, next) => {
  try {
    const [songs] = await db.query(
      `SELECT
            s.id,
            s.title 
       FROM SONGS s 
       INNER JOIN SONG_CATEGORIES sc ON sc.song_id = s.id 
       WHERE sc.category_id = ? 
       ORDER BY s.title`,
      [req.params.categoryId],
    );

    res.status(200).json({ songs });
  } catch (error) {
    res.sendStatus(401);
    next(error);
  }
};

module.exports = {
  getSongsByCategory,
};
