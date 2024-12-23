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
        DECLARE @InsertedRecord TABLE (MovieId INT, Title NVARCHAR(128), CreatedAt DATETIME2, UpdatedAt DATETIME2);

        INSERT INTO Movies (Title)
        OUTPUT inserted.MovieId, inserted.Title, inserted.CreatedAt, inserted.UpdatedAt INTO @InsertedRecord
        VALUES (@Title);

        SELECT * FROM @InsertedRecord;
      `);

    res.status(201).json(result.recordset[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error adding Movie to database" });
  }
});

// Route to update a movie
app.put("/api/movies/:id", async (req, res) => {
  const id = req.params.id;
  const updatedMovie = req.body;

  if (!Object.keys(updatedMovie).length) {
    return res.status(400).json({ message: "No fields provided to update" });
  }

  try {
    const pool = await getConnection();

    // Dynamically build SET clause
    const updates = Object.keys(updatedMovie)
      .map((key, index) => `${key} = @value${index}`)
      .join(", ");

    const request = await pool.request().input("id", id);

    // Bind the previous fields from the request body
    Object.keys(updatedMovie).forEach((key, index) => {
      request.input(`value${index}`, updatedMovie[key]);
    });

    // Execute the query
    const result = await request.query(
      `UPDATE Movies SET ${updates}, UpdatedAt = SYSDATETIME() WHERE MovieId = @id`
    );

    if (result.rowsAffected[0] > 0) {
      res.status(200).json({ message: "Movie updated successfully" });
    } else {
      res.status(404).json({ message: "Movie not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error updating movie", error });
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

// Route to update a TV Show
app.put("/api/tvshows/:id", async (req, res) => {
  const id = req.params.id;
  const updatedTvShow = req.body;

  if (!Object.keys(updatedTvShow).length) {
    return res.status(400).json({ message: "No fields provided to update" });
  }

  try {
    const pool = await getConnection();

    // Dynamically build SET clause
    const updates = Object.keys(updatedMovie)
      .map((key, index) => `${key} = @value${index}`)
      .join(", ");

    const request = await pool.request().input("id", id);

    // Bind the previous fields from the request body
    Object.keys(updatedTvShow).forEach((key, index) => {
      request.input(`value${index}`, updatedTvShow[key]);
    });

    // Execute the query
    const result = await request.query(
      `UPDATE TVShows SET ${updates}, UpdatedAt = SYSDATETIME() WHERE TVShowId = @id`
    );

    if (result.rowsAffected[0] > 0) {
      res.status(200).json({ message: "TV show updated successfully" });
    } else {
      res.status(404).json({ message: "TV show not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error updating TV show", error });
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

// Route to update a game
app.put("/api/games/:id", async (req, res) => {
  const id = req.params.id;
  const updatedGame = req.body;

  if (!Object.keys(updatedGame).length) {
    return res.status(400).json({ message: "No fields provided to update" });
  }

  try {
    const pool = await getConnection();

    // Dynamically build SET clause
    const updates = Object.keys(updatedMovie)
      .map((key, index) => `${key} = @value${index}`)
      .join(", ");

    const request = await pool.request().input("id", id);

    // Bind the previous fields from the request body
    Object.keys(updatedGame).forEach((key, index) => {
      request.input(`value${index}`, updatedGame[key]);
    });

    // Execute the query
    const result = await request.query(
      `UPDATE Games SET ${updates}, UpdatedAt = SYSDATETIME() WHERE GameId = @id`
    );

    if (result.rowsAffected[0] > 0) {
      res.status(200).json({ message: "Game updated successfully" });
    } else {
      res.status(404).json({ message: "Game not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error updating game", error });
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
