const db = require("../services/db");
require("dotenv").config();

const getCategories = async (req, res, next) => {
  try {
    const [songsCategories] = await db.query(
      `SELECT *
       FROM SONGS_CATEGORIES`,
    );

    res.status(200).json({ categories: songsCategories });
  } catch (error) {
    res.sendStatus(401);
    next(error);
  }
};

module.exports = {
  getCategories,
};
