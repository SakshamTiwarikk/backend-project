# 🎬 Movie Explorer Backend

Node.js + Express + PostgreSQL backend for fetching, storing, and serving movie data from the TMDB API, with full support for genres, cast, user authentication (JWT), and fallback mode.

---

## 🚀 Features

- ✅ Fetch top 500 movies from TMDB
- ✅ Store details, genres, and cast in PostgreSQL
- ✅ Fallback to local JSON if TMDB fails
- ✅ REST API for movies, genres, cast
- ✅ Signup + Login with JWT auth
- ✅ Environment-based configuration (`.env`)
- ✅ Ready for deployment (Render + Neon)

---

## 📦 Technologies Used

- Node.js / Express
- PostgreSQL (Neon DB)
- TMDB API
- JWT Auth
- Dotenv + CORS
- Axios + Axios-Retry

---

## ⚙️ Project Structure

movie-explorer-backend/
│
├── controllers/
├── routes/
├── services/
├── seed/ # TMDB data fetching and DB insert
├── fallback/ # JSON backup in case TMDB fails
├── db/ # PostgreSQL Pool setup
├── middleware/ # Auth middleware
│
├── .env
├── index.js # App entry
├── package.json
└── README.md


---

## 🧪 API Endpoints

### 🔐 Auth

| Method | Route           | Description     |
|--------|------------------|-----------------|
| POST   | `/api/auth/signup` | Register a new user |
| POST   | `/api/auth/login`  | Login and get token  |

---

### 🎬 Movies

| Method | Route               | Description               |
|--------|----------------------|---------------------------|
| GET    | `/api/movies`        | Get all movies            |
| GET    | `/api/movies/:id`    | Get movie by ID           |
| GET    | `/api/genres`        | List all genres           |
| GET    | `/api/cast/:movieId` | Get cast for a movie      |

> 🔐 Protected routes require Bearer Token in `Authorization` header.

---

## 🧑‍💻 Setup Locally

```bash
# Clone and install
git clone https://github.com/yourusername/movie-explorer-backend.git
cd movie-explorer-backend
npm install

# Setup your .env file
cp .env.example .env

# Run seed script
node seed/fetchAndInsert.js

# Start server
node index.js

## 🧑‍💻 Postman
<img width="1815" height="884" alt="image" src="https://github.com/user-attachments/assets/e90ee488-be31-4996-8a42-79fd6a072752" />
<img width="1787" height="882" alt="image" src="https://github.com/user-attachments/assets/bdf20679-81df-437d-a705-26640475c7db" />
<img width="1782" height="917" alt="image" src="https://github.com/user-attachments/assets/0687a793-5904-4019-a020-1ea16c8bad2d" />



