const db = require("../services/db");
require("dotenv").config();

const getCategories = async (req, res, next) => {
  try {
    const [songsCategories] = await db.query(
      `
        SELECT
          sc.id,
          sc.name,
          COUNT(s.id) AS songCount
        FROM SONGS_CATEGORIES sc
        LEFT JOIN SONG_CATEGORIES scs
          ON scs.category_id = sc.id
        LEFT JOIN SONGS s
          ON s.id = scs.song_id
        GROUP BY
          sc.id,
          sc.name
        ORDER BY sc.name
      `,
    );

    res.status(200).json({
      categories: songsCategories,
    });
  } catch (error) {
    res.sendStatus(401);
    next(error);
  }
};

module.exports = {
  getCategories,
};
