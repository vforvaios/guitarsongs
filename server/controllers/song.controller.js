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
          s.artist_id,
          sc.category_id,
          a.name AS "artistName",
          CASE
            WHEN f.song_id IS NOT NULL THEN 1
            ELSE 0
          END AS is_favorite
        FROM songs s
        INNER JOIN artists a
          ON a.id = s.artist_id
        LEFT JOIN song_categories sc
          ON sc.song_id = s.id
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

const updateSong = async (req, res, next) => {
  const { songId } = req.params;
  const { title, artist_id, category_id, content } = req.body;

  if (!title?.trim() || !artist_id || !category_id || !content?.trim()) {
    return res.status(400).json({
      message: "All fields are required",
    });
  }

  const client = await db.connect();

  try {
    await client.query("BEGIN");

    const { rowCount } = await client.query(
      `
        UPDATE songs
        SET
          title = $1,
          artist_id = $2,
          content = $3
        WHERE id = $4
      `,
      [title.trim(), artist_id, content, songId],
    );

    if (rowCount === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({
        message: "Song not found",
      });
    }

    await client.query(
      `
        INSERT INTO song_categories (song_id, category_id)
        VALUES ($1, $2)
        ON CONFLICT (song_id)
        DO UPDATE SET category_id = EXCLUDED.category_id
      `,
      [songId, category_id],
    );

    await client.query("COMMIT");

    return res.status(200).json({
      message: "Song updated successfully",
    });
  } catch (error) {
    await client.query("ROLLBACK");
    next(error);
  } finally {
    client.release();
  }
};

const deleteSong = async (req, res, next) => {
  const { id } = req.params;

  const client = await db.connect();

  try {
    await client.query("BEGIN");

    const {
      rowCount,
    } = await client.query(`SELECT id FROM songs WHERE id = $1 FOR UPDATE`, [
      id,
    ]);

    if (rowCount === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({
        message: "Song not found",
      });
    }

    await client.query(`DELETE FROM song_categories WHERE song_id = $1`, [id]);

    await client.query(`DELETE FROM favorite_songs WHERE song_id = $1`, [id]);

    await client.query(`DELETE FROM songs WHERE id = $1`, [id]);

    await client.query("COMMIT");

    return res.status(200).json({
      message: "Song deleted successfully",
    });
  } catch (error) {
    await client.query("ROLLBACK");
    next(error);
  } finally {
    client.release();
  }
};

module.exports = {
  getSongById,
  updateSong,
  deleteSong,
};
