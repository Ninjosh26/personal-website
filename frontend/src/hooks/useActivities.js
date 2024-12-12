import { useState, useEffect } from "react";
import { activityCategories } from "../components";

const useActivities = () => {
  const [movies, setMovies] = useState([]);
  const [tvShows, setTvShows] = useState([]);
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to fetch activities
  const fetchActivities = async (url, category) => {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to fetch ${category}`);
    return await response.json();
  };

  useEffect(() => {
    const fetchAllActivities = async () => {
      try {
        setMovies(
          await fetchActivities("http://localhost:5000/api/movies", "movies")
        );
        setTvShows(
          await fetchActivities("http://localhost:5000/api/tvshows", "TV shows")
        );
        setGames(
          await fetchActivities("http://localhost:5000/api/games", "games")
        );
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
        const response = await fetch(`http://localhost:5000/api/${category}`, {
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
      const response = await fetch("http://localhost:5000/api/activities", {
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

  return {
    movies,
    tvShows,
    games,
    loading,
    error,
    addActivity,
    deleteActivities,
  };
};

export default useActivities;
