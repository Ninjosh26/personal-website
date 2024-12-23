import { useEffect } from "react";
import { ActivityOptions } from "../components";
import useActivities from "../hooks/useActivities";

export default function ActivityChoices() {
  const {
    movies,
    tvShows,
    games,
    addActivity,
    updateActivity,
    deleteActivities,
  } = useActivities();

  useEffect(() => {
    document.title = "Kate's Website - Activity Choices";
  }, []);

  return (
    <div style={{ paddingLeft: "20px", paddingRight: "20px" }}>
      <h1 style={{ color: "white" }}>Activity Choices</h1>
      <ActivityOptions
        movies={movies}
        tvShows={tvShows}
        games={games}
        addItem={addActivity}
        updateItem={updateActivity}
        deleteItems={deleteActivities}
      />
    </div>
  );
}
