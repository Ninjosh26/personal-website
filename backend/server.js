const express = require("express");
const cors = require("cors");
const sql = require("mssql");
const { getConnection } = require("./dbConfig");

const app = express();
const port = process.env.PORT || 5000; // Default to port 5000

// Middleware
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // Parse JSON bodies

// Route to get Movies
app.get("/api/movies", async (req, res) => {
  try {
    const pool = await getConnection();
    const result = await pool.request().query("SELECT * FROM Movies");
    res.json(result.recordset);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching movies from database" });
  }
});

// Route to add a new Movie
app.post("/api/movies", async (req, res) => {
  const { Title } = req.body;

  // Validate the request body
  if (!Title) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const pool = await getConnection();
    const result = await pool.request().input("Title", sql.NVarChar, Title)
      .query(`
        DECLARE @InsertedRecord TABLE (MovieId INT, Title NVARCHAR(128), CreatedAt DATETIME2);

        INSERT INTO Movies (Title)
        OUTPUT inserted.MovieId, inserted.Title, inserted.CreatedAt INTO @InsertedRecord
        VALUES (@Title);

        SELECT * FROM @InsertedRecord;
      `);

    res.status(201).json(result.recordset[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error adding Movie to database" });
  }
});

// Route to get TV shows
app.get("/api/tvshows", async (req, res) => {
  try {
    const pool = await getConnection();
    const result = await pool.request().query("SELECT * FROM TVShows");
    res.json(result.recordset);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching TV Shows from database" });
  }
});

// Route to add a new TV Show
app.post("/api/tvshows", async (req, res) => {
  const { Title } = req.body;

  // Validate the request body
  if (!Title) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const pool = await getConnection();
    const result = await pool.request().input("Title", sql.NVarChar, Title)
      .query(`
        DECLARE @InsertedRecord TABLE (TVShowId INT, Title NVARCHAR(128), CreatedAt DATETIME2);

        INSERT INTO TVShows (Title)
        OUTPUT inserted.TVShowId, inserted.Title, inserted.CreatedAt INTO @InsertedRecord
        VALUES (@Title);

        SELECT * FROM @InsertedRecord;
      `);

    res.status(201).json(result.recordset[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error adding TV Show to database" });
  }
});

// Route to get Games
app.get("/api/games", async (req, res) => {
  try {
    const pool = await getConnection();
    const result = await pool.request().query("SELECT * FROM Games");
    res.json(result.recordset);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching games from database" });
  }
});

// Route to add a new Game
app.post("/api/games", async (req, res) => {
  const { Title } = req.body;

  // Validate the request body
  if (!Title) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const pool = await getConnection();
    const result = await pool.request().input("Title", sql.NVarChar, Title)
      .query(`
        DECLARE @InsertedRecord TABLE (GameId INT, Title NVarChar(128), CreatedAt DATETIME2);
    
        INSERT INTO Games (Title)
        OUTPUT inserted.GameId, inserted.Title, inserted.CreatedAt INTO @InsertedRecord
        VALUES (@Title);

        SELECT * FROM @InsertedRecord;
      `);

    res.status(201).json(result.recordset[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error adding game to database" });
  }
});

// Route to batch delete activities
app.delete("/api/activities", async (req, res) => {
  const { movies, tvShows, games } = req.body;

  if (
    !Array.isArray(movies) ||
    !Array.isArray(tvShows) ||
    !Array.isArray(games)
  ) {
    return res.status(400).json({ message: "Invalid input data" });
  }

  try {
    const pool = await getConnection();

    // Delete movies
    if (movies.length > 0) {
      await pool.request().query(`
        DELETE FROM Movies
        WHERE MovieId IN (${movies.join(",")})
      `);
    }

    // Delete TV shows
    if (tvShows.length > 0) {
      await pool.request().query(`
        DELETE FROM TVShows
        WHERE TVShowId IN (${tvShows.join(",")})
      `);
    }

    // Delete games
    if (games.length > 0) {
      await pool.request().query(`
        DELETE FROM Games
        WHERE GameId IN (${games.join(",")})
      `);
    }

    res.status(200).json({ message: "Activities deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting activities" });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Backend is running on port ${port}`);
});

// Close the pool when the app terminates
process.on("SIGINT", async () => {
  try {
    const pool = await getConnection();
    await pool.close();
    console.log("Connection pool closed");
    process.exit(0);
  } catch (error) {
    console.error("Error closing connection pool:", error);
    process.exit(1);
  }
});
