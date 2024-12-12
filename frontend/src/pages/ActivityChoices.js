import { ActivityOptions } from "../components";
import useActivities from "../hooks/useActivities";

export default function ActivityChoices() {
  const { movies, tvShows, games, addActivity, deleteActivities } =
    useActivities();

  return (
    <div style={{ paddingLeft: "20px", paddingRight: "20px" }}>
      <h1 style={{ color: "white" }}>Activity Choices</h1>
      <ActivityOptions
        movies={movies}
        tvShows={tvShows}
        games={games}
        addItem={addActivity}
        deleteItems={deleteActivities}
      />
    </div>
  );
}
