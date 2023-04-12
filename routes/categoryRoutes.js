const express = require("express");
const { getCategories } = require("../controllers/CategoryController");
const router = express.Router();

router.post("/", getCategories);

module.exports = router;
