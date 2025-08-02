const express = require("express");
const router = express.Router();
const {
  getMovies,
  getGenres,
  getCastByMovie,
} = require("../controllers/movieController");
const { authMiddleware } = require('../middleware/authMiddleware');

router.get('/movies', authMiddleware, getMovies);
router.get("/genres", getGenres); // ✅
router.get("/cast/:movie_id", getCastByMovie); // ✅

module.exports = router;
