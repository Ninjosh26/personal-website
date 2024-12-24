import { useState } from "react";
import {
  Button,
  FormControl,
  FormHelperText,
  IconButton,
  MenuItem,
  Select,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import CasinoIcon from "@mui/icons-material/Casino";
import DeleteIcon from "@mui/icons-material/Delete";

import ConfirmDialog from "./ConfirmDialog";
import RandomizerDialog from "./RandomizerDialog";
import ActivityTable from "./ActivityTable";
import EditDialog from "./EditDialog";

export const activityCategories = {
  movies: "movies",
  tvShows: "tvShows",
  games: "games",
};

export default function ActivityOptions({
  movies,
  tvShows,
  games,
  addItem,
  addTrigger,
  updateItem,
  deleteItems,
}) {
  const [newValue, setNewValue] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(
    activityCategories.movies
  );
  const [selected, setSelected] = useState({
    movies: [],
    tvShows: [],
    games: [],
  });
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [randomizerOpen, setRandomizerOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editProps, setEditProps] = useState({
    id: 0,
    category: "",
    fields: [],
  });

  const internalAddItem = () => {
    addItem(newValue, selectedCategory);
    setNewValue("");
  };

  const onSelectCategory = (event) => {
    setSelectedCategory(event.target.value);
  };

  const onChangeValue = (event) => {
    setNewValue(event.target.value);
  };

  const handleSelectClick = (category, id) => {
    const selectedIndex = selected[category].indexOf(id);

    const handleSelectArray = (oldArray) => {
      if (selectedIndex === -1) {
        return [].concat(oldArray, id);
      } else if (selectedIndex === 0) {
        return [].concat(oldArray.slice(1));
      } else if (selectedIndex === oldArray.length - 1) {
        return [].concat(oldArray.slice(0, -1));
      } else if (selectedIndex > 0) {
        return [].concat(
          oldArray.slice(0, selectedIndex),
          oldArray.slice(selectedIndex + 1)
        );
      }
    };

    let newSelected = {
      movies:
        category === "movies"
          ? handleSelectArray(selected.movies)
          : selected.movies,
      tvShows:
        category === "tvShows"
          ? handleSelectArray(selected.tvShows)
          : selected.tvShows,
      games:
        category === "games"
          ? handleSelectArray(selected.games)
          : selected.games,
    };

    setSelected(newSelected);
  };

  const onConfirmDeleteClose = (event, reason) => {
    if (reason === "delete-clicked") {
      deleteItems(selected);
      setSelected({
        movies: [],
        tvShows: [],
        games: [],
      });
    }
    setConfirmDeleteOpen(false);
  };

  const handleSelectAll = (event, category) => {
    let newSelected = [];

    const getAll = (array) => array.map((_, idx) => idx);

    if (event.target.checked) {
      switch (category) {
        case "movies":
          newSelected = getAll(movies);
          break;
        case "tvShows":
          newSelected = getAll(tvShows);
          break;
        case "games":
          newSelected = getAll(games);
          break;
        default:
          break;
      }
    }

    setSelected((prevSelected) => ({
      movies: category === "movies" ? newSelected : prevSelected.movies,
      tvShows: category === "tvShows" ? newSelected : prevSelected.tvShows,
      games: category === "games" ? newSelected : prevSelected.games,
    }));
  };

  const handleEdit = (activity, category) => {
    setEditProps((prevProps) => {
      const updated = { ...prevProps };

      if (category === "movies") {
        updated.id = activity.MovieId;
      } else if (category === "tvShows") {
        updated.id = activity.TVShowId;
      } else if (category === "games") {
        updated.id = activity.GameId;
      }

      updated.category = category;
      updated.fields = [
        {
          label: "Title",
          value: activity.Title,
        },
      ];

      return updated;
    });

    setEditOpen(true);
  };

  const handleUpdate = (id, category, fields) => {
    const updateFields = {};

    fields.forEach((field) => {
      if (field.label === "Title") {
        updateFields.Title = field.value.trim();
      }
    });

    updateItem(id, category, updateFields);
    setEditOpen(false);
  };

  return (
    <div style={{ padding: 20 }}>
      <div style={{ display: "flex", gap: "20px" }}>
        <FormControl style={{ width: "200px" }}>
          <Select
            value={selectedCategory}
            onChange={onSelectCategory}
            style={{
              height: "55px",
              backgroundColor: "white",
              borderRadius: "4px",
            }}
          >
            <MenuItem value={activityCategories.movies}>Movie</MenuItem>
            <MenuItem value={activityCategories.tvShows}>TV Show</MenuItem>
            <MenuItem value={activityCategories.games}>Game</MenuItem>
          </Select>
          <FormHelperText style={{ color: "white" }}>
            Select Activity Type
          </FormHelperText>
        </FormControl>
        <TextField
          placeholder="Enter name"
          variant="outlined"
          value={newValue}
          onChange={onChangeValue}
          style={{
            width: "300px",
            height: "55px",
            backgroundColor: "white",
            borderRadius: "4px",
          }}
        />
        <Tooltip title="Add a New Activity">
          <Button
            variant="contained"
            onClick={internalAddItem}
            style={{
              height: "55px",
              padding: "0 20px",
              borderRadius: "4px",
              backgroundColor: "#333",
            }}
          >
            Add
          </Button>
        </Tooltip>
        <Tooltip title="Randomly Choose a Selected Activity">
          <IconButton
            onClick={() => setRandomizerOpen(true)}
            style={{
              marginLeft: "40px",
              height: "55px",
              width: "55px",
              padding: "0",
              backgroundColor: "#a0d98f",
              borderRadius: "4px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <CasinoIcon style={{ fontSize: "24px", color: "white" }} />
          </IconButton>
        </Tooltip>
        {(selected.movies.length > 0 ||
          selected.tvShows.length > 0 ||
          selected.games.length > 0) && (
          <Tooltip title="Delete Selected Activities">
            <IconButton
              onClick={() => setConfirmDeleteOpen(true)}
              style={{
                height: "55px",
                width: "55px",
                padding: "0",
                backgroundColor: "#f56e6e",
                borderRadius: "4px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <DeleteIcon style={{ fontSize: "24px", color: "white" }} />
            </IconButton>
          </Tooltip>
        )}
      </div>
      <div style={{ marginTop: "20px" }}>
        <div style={{ display: "flex", marginBottom: "5px" }}>
          <h2
            style={{
              color: "white",
              fontSize: "24px",
              marginTop: "0px",
              marginBottom: "4px",
            }}
          >
            {`Movies (${movies.length})`}
          </h2>
        </div>
        <ActivityTable
          activities={movies}
          category="movies"
          selected={selected}
          handleSelectClick={handleSelectClick}
          handleSelectAll={handleSelectAll}
          handleEdit={handleEdit}
          triggerScroll={addTrigger}
        />
      </div>
      <div style={{ marginTop: "20px" }}>
        <div style={{ display: "flex", marginBottom: "5px" }}>
          <h2
            style={{
              color: "white",
              fontSize: "24px",
              marginTop: "0px",
              marginBottom: "4px",
            }}
          >
            {`TV Shows (${tvShows.length})`}
          </h2>
        </div>
        <ActivityTable
          activities={tvShows}
          category="tvShows"
          selected={selected}
          handleSelectClick={handleSelectClick}
          handleSelectAll={handleSelectAll}
          handleEdit={handleEdit}
          triggerScroll={addTrigger}
        />
      </div>
      <div style={{ marginTop: "20px" }}>
        <div style={{ display: "flex", marginBottom: "5px" }}>
          <h2
            style={{
              color: "white",
              fontSize: "24px",
              marginTop: "0px",
              marginBottom: "4px",
            }}
          >
            {`Games (${games.length})`}
          </h2>
        </div>
        <ActivityTable
          activities={games}
          category="games"
          selected={selected}
          handleSelectClick={handleSelectClick}
          handleSelectAll={handleSelectAll}
          handleEdit={handleEdit}
          triggerScroll={addTrigger}
        />
      </div>
      <ConfirmDialog
        isOpen={confirmDeleteOpen}
        onClose={onConfirmDeleteClose}
        title={"Confirm Activity Deletion"}
        dialogBody={
          <>
            <Typography variant="body1">
              Are you sure you want to delete these activities?
            </Typography>
            <Typography variant="body2">Movies:</Typography>
            <ul>
              {selected.movies.map((idx) => (
                <li key={idx}>{movies[idx].Title}</li>
              ))}
            </ul>
            <Typography variant="body2">TV Shows:</Typography>
            <ul>
              {selected.tvShows.map((idx) => (
                <li key={idx}>{tvShows[idx].Title}</li>
              ))}
            </ul>
            <Typography variant="body2">Games:</Typography>
            <ul>
              {selected.games.map((idx) => (
                <li key={idx}>{games[idx].Title}</li>
              ))}
            </ul>
          </>
        }
      />
      <RandomizerDialog
        movies={movies}
        tvShows={tvShows}
        games={games}
        selected={selected}
        handleSelectClick={handleSelectClick}
        handleSelectAll={handleSelectAll}
        isOpen={randomizerOpen}
        onClose={() => setRandomizerOpen(false)}
      />
      <EditDialog
        open={editOpen}
        onClose={() => setEditOpen(false)}
        onUpdate={(id, fields) => handleUpdate(id, editProps.category, fields)}
        title="Edit Activity"
        id={editProps.id}
        fields={editProps.fields}
      />
    </div>
  );
}
