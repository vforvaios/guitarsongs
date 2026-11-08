const db = require("../services/db");

const getSongsByCategory = async (req, res, next) => {
  try {
    const categoryId = req.params.categoryId;

    const { rows: categories } = await db.query(
      `
        SELECT
          id,
          name
        FROM songs_categories
        WHERE id = $1
      `,
      [categoryId],
    );

    const category = categories[0];

    if (!category) {
      return res.status(404).json({
        message: "Category not found",
      });
    }

    const { rows: songs } = await db.query(
      `
        SELECT
          s.id,
          s.title,
          s.artist_id,
          s.created_at,
          art.name AS artist_name,
          CASE
            WHEN f.song_id IS NOT NULL THEN 1
            ELSE 0
          END AS is_favorite
        FROM songs s
        INNER JOIN song_categories sc
          ON sc.song_id = s.id
        INNER JOIN artists art
          ON art.id = s.artist_id
        LEFT JOIN favorite_songs f
          ON f.song_id = s.id
        WHERE sc.category_id = $1
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

    const { rows: songs } = await db.query(
      `
        SELECT
          s.id,
          s.title,
          a.id AS artist_id,
          a.name AS artist_name,
          CASE
            WHEN f.song_id IS NOT NULL THEN 1
            ELSE 0
          END AS is_favorite
        FROM songs s
        LEFT JOIN artists a
          ON a.id = s.artist_id
        LEFT JOIN favorite_songs f
          ON f.song_id = s.id
        WHERE s.title ILIKE $1
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

const createSong = async (req, res, next) => {
  const { title, artist_id, category_id, content } = req.body;

  if (!title?.trim() || !artist_id || !category_id || !content?.trim()) {
    return res.status(400).json({
      message: "Missing required fields",
    });
  }

  const client = await db.connect();

  try {
    await client.query("BEGIN");

    const result = await client.query(
      `
        INSERT INTO SONGS (title, artist_id, content)
        VALUES ($1, $2, $3)
        RETURNING id
      `,
      [title.trim(), artist_id, content],
    );

    const songId = result.rows[0].id;

    await client.query(
      `
          INSERT INTO SONG_CATEGORIES (song_id, category_id)
          VALUES ($1, $2)
        `,
      [songId, category_id],
    );

    await client.query("COMMIT");

    return res.status(200).json({
      message: "Song created successfully",
      songId,
    });
  } catch (error) {
    await client.query("ROLLBACK");
    next(error);
  } finally {
    client.release();
  }
};

module.exports = {
  getSongsByCategory,
  searchSongs,
  createSong,
};
