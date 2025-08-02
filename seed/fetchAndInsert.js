const db = require("../db/db");
const {
  fetchDiscoverMovies,
  fetchMovieDetails,
  fetchMovieCredits,
} = require("../services/tmdbService");

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function insertGenre(genre) {
  await db.query(
    `INSERT INTO genres (id, name)
    VALUES ($1, $2) ON CONFLICT (id) DO NOTHING`,
    [genre.id, genre.name]
  );
}

async function insertMovie(movie) {
  await db.query(
    `INSERT INTO movies (id, title, overview, release_date, popularity, vote_average, vote_count, revenue)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8) ON CONFLICT (id) DO NOTHING`,
    [
      movie.id,
      movie.title,
      movie.overview,
      movie.release_date,
      movie.popularity,
      movie.vote_average,
      movie.vote_count,
      movie.revenue || 0,
    ]
  );
}

async function insertMovieGenres(movieId, genres) {
  for (const genre of genres) {
    await db.query(
      `INSERT INTO movie_genres (movie_id, genre_id)
      VALUES ($1, $2) ON CONFLICT DO NOTHING`,
      [movieId, genre.id]
    );
  }
}

async function insertActor(actor) {
  await db.query(
    `INSERT INTO actors (id, name, gender, profile_path)
    VALUES ($1, $2, $3, $4) ON CONFLICT (id) DO NOTHING`,
    [actor.id, actor.name, actor.gender, actor.profile_path]
  );
}

async function insertMovieActors(movieId, castList) {
  for (const actor of castList.slice(0, 10)) {
    await insertActor(actor);
    await db.query(
      `INSERT INTO movie_actors (movie_id, actor_id, character)
      VALUES ($1, $2, $3) ON CONFLICT DO NOTHING`,
      [movieId, actor.id, actor.character]
    );
  }
}

async function main() {
  let totalInserted = 0;
  for (let page = 1; page <= 1 && totalInserted < 10; page++) {
    const movies = await fetchDiscoverMovies(page);

    for (const movie of movies) {
      try {
        const details = await fetchMovieDetails(movie.id);
        const castList = await fetchMovieCredits(movie.id);

        await insertMovie(details);
        for (const genre of details.genres) await insertGenre(genre);
        await insertMovieGenres(details.id, details.genres);
        await insertMovieActors(details.id, castList);

        totalInserted++;
        console.log(`✅ Inserted: ${details.title} (${totalInserted})`);

        await wait(300); // delay to avoid hitting TMDB too fast

        if (totalInserted >= 10) break;
      } catch (err) {
        console.error(`❌ Error inserting movie ID ${movie.id}:`, err.message);
        await wait(500); // wait before next movie even on error
      }
    }
  }
  console.log("🎉 Done inserting sample 10 movies");
  process.exit();
}

main().catch((err) => {
  console.error("🔥 Fatal error:", err.message);
  process.exit(1);
});
