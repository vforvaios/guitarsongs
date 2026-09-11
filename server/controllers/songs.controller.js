const db = require("../services/db");
require("dotenv").config();

const getSongsByCategory = async (req, res, next) => {
  try {
    const categoryId = req.params.categoryId;

    const [[category]] = await db.query(
      `
    SELECT
      id,
      name
    FROM SONGS_CATEGORIES
    WHERE id = ?
  `,
      [categoryId],
    );

    if (!category) {
      return res.status(404).json({
        message: "Category not found",
      });
    }

    const [songs] = await db.query(
      `
    SELECT
      s.id,
      s.title
    FROM SONGS s
    INNER JOIN SONG_CATEGORIES sc
      ON sc.song_id = s.id
    WHERE sc.category_id = ?
    ORDER BY s.title
  `,
      [categoryId],
    );

    return res.json({
      songs,
      categoryName: category.name,
      count: songs.length,
    });
  } catch (error) {
    res.sendStatus(401);
    next(error);
  }
};

module.exports = {
  getSongsByCategory,
};
