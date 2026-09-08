const express = require("express");
const verifyToken = require("../utils/verifyToken");
const Categories = require("../controllers/categories.controller");

const router = express.Router();

router.get("/", Categories.getCategories);

module.exports = router;
