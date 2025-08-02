const db = require("../db/db");

exports.getMovies = async (req, res) => {
  try {
    const {
      year,
      genres,
      without_genres,
      sort_by = "popularity",
      order = "desc",
      search,
      page = 1,
      limit = 20,
    } = req.query;

    const offset = (page - 1) * limit;

    let query = `
      SELECT DISTINCT m.*
      FROM movies m
      LEFT JOIN movie_genres mg ON m.id = mg.movie_id
      LEFT JOIN genres g ON g.id = mg.genre_id
      LEFT JOIN movie_actors ma ON ma.movie_id = m.id
      LEFT JOIN actors a ON a.id = ma.actor_id
      WHERE 1=1
    `;
    const params = [];

    if (year) {
      params.push(year);
      query += ` AND EXTRACT(YEAR FROM m.release_date) = $${params.length}`;
    }

    if (genres) {
      const genreList = genres.split(",").map((id) => parseInt(id));
      query += ` AND g.id = ANY($${params.push(genreList)})`;
    }

    if (without_genres) {
      const genreList = without_genres.split(",").map((id) => parseInt(id));
      query += ` AND m.id NOT IN (
        SELECT movie_id FROM movie_genres WHERE genre_id = ANY($${params.push(
          genreList
        )})
      )`;
    }

    if (search) {
      query += ` AND (LOWER(m.title) LIKE $${params.push(
        `%${search.toLowerCase()}%`
      )} 
                  OR LOWER(a.name) LIKE $${params.push(
                    `%${search.toLowerCase()}%`
                  )})`;
    }

    // Sorting
    const allowedSort = [
      "popularity",
      "vote_average",
      "vote_count",
      "release_date",
      "revenue",
      "title",
    ];
    const sortField = allowedSort.includes(sort_by) ? sort_by : "popularity";
    const sortOrder = order === "asc" ? "ASC" : "DESC";
    query += ` ORDER BY m.${sortField} ${sortOrder}`;

    query += ` LIMIT $${params.push(limit)} OFFSET $${params.push(offset)}`;

    const { rows } = await db.query(query, params);

    res.json({ success: true, data: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
exports.getGenres = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM genres ORDER BY name');
    res.json({ success: true, data: result.rows });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error fetching genres' });
  }
};
exports.getCastByMovie = async (req, res) => {
  const { movie_id } = req.params;
  try {
    const result = await db.query(`
      SELECT a.id, a.name, a.gender, a.profile_path, ma.character
      FROM actors a
      JOIN movie_actors ma ON a.id = ma.actor_id
      WHERE ma.movie_id = $1
    `, [movie_id]);
    res.json({ success: true, data: result.rows });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error fetching cast' });
  }
};