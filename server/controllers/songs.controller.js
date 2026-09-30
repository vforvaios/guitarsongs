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
      s.title,
      s.artist_id,
      art.name AS artist_name
    FROM SONGS s
    INNER JOIN SONG_CATEGORIES sc
      ON sc.song_id = s.id
    INNER JOIN ARTISTS art
      ON art.id = s.artist_id
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

const searchSongs = async (req, res, next) => {
  try {
    const { search } = req.body;

    if (!search || !search.trim()) {
      return res.status(200).json({
        songs: [],
        count: 0,
      });
    }

    const searchTerm = `%${search.trim()}%`;

    const [songs] = await db.query(
      `
      SELECT
        s.id,
        s.title,
        a.id AS artist_id,
        a.name AS artist_name
      FROM SONGS s
      LEFT JOIN ARTISTS a ON a.id = s.artist_id
      WHERE s.title LIKE ?
      ORDER BY s.title
      `,
      [searchTerm],
    );

    res.status(200).json({
      songs,
      count: songs.length,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getSongsByCategory,
  searchSongs,
};
