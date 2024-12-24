import { useState, useEffect } from "react";
import { activityCategories } from "../components";

const API_URL = process.env.REACT_APP_API_URL;

const useActivities = () => {
  const [movies, setMovies] = useState([]);
  const [tvShows, setTvShows] = useState([]);
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [addTrigger, setAddTrigger] = useState(null);

  // Function to fetch activities
  const fetchActivities = async (url, category) => {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to fetch ${category}`);
    return await response.json();
  };

  useEffect(() => {
    const fetchAllActivities = async () => {
      try {
        setMovies(await fetchActivities(`${API_URL}/movies`, "movies"));
        setTvShows(await fetchActivities(`${API_URL}/tvshows`, "TV shows"));
        setGames(await fetchActivities(`${API_URL}/games`, "games"));
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAllActivities();
  }, []);

  // Function to add an activity (movie, TV show, or game)
  const addActivity = async (title, category) => {
    if (title.trim()) {
      try {
        const response = await fetch(`${API_URL}/${category}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ Title: title }),
        });

        if (!response.ok) throw new Error(`Failed to add ${category}`);
        const data = await response.json();

        // Update the apporpriate state based on category
        if (category === activityCategories.movies) {
          setMovies((prevMovies) => [...prevMovies, data]);
        } else if (category === activityCategories.tvShows) {
          setTvShows((prevTvShows) => [...prevTvShows, data]);
        } else if (category === activityCategories.games) {
          setGames((prevGames) => [...prevGames, data]);
        } else {
          console.error(`Unrecognized type: ${category}`);
        }

        setAddTrigger(category);
        setTimeout(() => setAddTrigger(null), 5000);

        return data;
      } catch (error) {
        setError(error.message);
        alert("Error adding activity");
      }
    }
  };

  // Function to delete activities
  const deleteActivities = async (selected) => {
    const filterList = (list, deleteSet) =>
      list.filter((_, idx) => !deleteSet.has(idx));

    let selectedIds = {
      movies: selected.movies.map((idx) => movies[idx].MovieId),
      tvShows: selected.tvShows.map((idx) => tvShows[idx].TVShowId),
      games: selected.games.map((idx) => games[idx].GameId),
    };

    try {
      const response = await fetch(`${API_URL}/activities`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(selectedIds),
      });
      if (!response.ok) throw new Error("Failed to delete activities");

      setMovies(filterList(movies, new Set(selected.movies), "MovieId"));
      setTvShows(filterList(tvShows, new Set(selected.tvShows), "TVShowId"));
      setGames(filterList(games, new Set(selected.games), "GameId"));
    } catch (error) {
      setError(error.message);
      alert("Error deleting activities");
    }
  };

  // Function to update an activity
  const updateActivity = async (id, category, fields) => {
    try {
      const response = await fetch(`${API_URL}/${category}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(fields),
      });
      if (!response.ok) throw new Error("Failed to update activity");

      if (category === "movies") {
        setMovies(
          movies.map((movie) =>
            id === movie.MovieId ? { ...movie, ...fields } : movie
          )
        );
      } else if (category === "tvShows") {
        setTvShows(
          tvShows.map((tvShow) =>
            id === tvShow.TVShowId ? { ...tvShow, ...fields } : tvShow
          )
        );
      } else if (category === "games") {
        setGames(
          games.map((game) =>
            id === game.GameId ? { ...game, ...fields } : game
          )
        );
      }
    } catch (error) {
      setError(error.message);
      alert("Error updating activity");
    }
  };

  return {
    movies,
    tvShows,
    games,
    loading,
    error,
    addTrigger,
    addActivity,
    updateActivity,
    deleteActivities,
  };
};

export default useActivities;
