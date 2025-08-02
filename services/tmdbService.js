const axios = require("axios");
const axiosRetry = require("axios-retry").default; // ✅ Fix here
require("dotenv").config();

const BASE_URL = "https://api.themoviedb.org/3";

const headers = {
  Authorization: `Bearer ${process.env.TMDB_ACCESS_TOKEN}`,
};

axiosRetry(axios, {
  retries: 3,
  retryDelay: (retryCount) => {
    console.warn(`🔁 Retry attempt: ${retryCount}`);
    return retryCount * 500;
  },
  retryCondition: (error) => {
    return error.code === "ECONNRESET" || error.code === "ETIMEDOUT";
  },
});

async function fetchDiscoverMovies(page = 1) {
  const res = await axios.get(`${BASE_URL}/discover/movie`, {
    headers,
    params: { page },
  });
  return res.data.results;
}

async function fetchMovieDetails(movieId) {
  const res = await axios.get(`${BASE_URL}/movie/${movieId}`, { headers });
  return res.data;
}

async function fetchMovieCredits(movieId) {
  const res = await axios.get(`${BASE_URL}/movie/${movieId}/credits`, {
    headers,
  });
  return res.data.cast;
}

module.exports = {
  fetchDiscoverMovies,
  fetchMovieDetails,
  fetchMovieCredits,
};
