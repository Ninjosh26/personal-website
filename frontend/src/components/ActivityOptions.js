import { useState } from "react";
import {
  Button,
  Checkbox,
  FormControl,
  FormHelperText,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
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
    console.log(newSelected);

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
              backgroundColor: "green",
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
                backgroundColor: "#f44336",
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
          <Checkbox
            edge="start"
            indeterminate={
              selected.movies.length > 0 &&
              selected.movies.length < movies.length
            }
            checked={
              movies.length > 0 && selected.movies.length === movies.length
            }
            onChange={(event) => handleSelectAll(event, "movies")}
            sx={{
              color: "white",
              fontSize: "24px",
              paddingY: "0px",
              paddingLeft: "10px",
              paddingRight: "8px",
              "&.Mui-checked": {
                color: "#CDDC39",
              },
              "&.MuiCheckbox-indeterminate": {
                color: "#CDDC39",
              },
            }}
          />
          <h2
            style={{
              color: "white",
              fontSize: "24px",
              marginTop: "0px",
              marginBottom: "4px",
            }}
          >
            Movies
          </h2>
        </div>
        <List
          style={{
            backgroundColor: "#f4f4f9",
            borderRadius: "8px",
            padding: "10px",
          }}
        >
          {movies.map((movie, idx) => {
            return (
              <ListItem key={idx}>
                <ListItemIcon>
                  <Checkbox
                    edge="start"
                    onChange={() => handleSelectClick("movies", idx)}
                    checked={selected.movies.includes(idx)}
                  />
                </ListItemIcon>
                <ListItemText primary={movie.Title} />
              </ListItem>
            );
          })}
        </List>
      </div>
      <div style={{ marginTop: "20px" }}>
        <div style={{ display: "flex", marginBottom: "5px" }}>
          <Checkbox
            edge="start"
            indeterminate={
              selected.tvShows.length > 0 &&
              selected.tvShows.length < tvShows.length
            }
            checked={
              tvShows.length > 0 && selected.tvShows.length === tvShows.length
            }
            onChange={(event) => handleSelectAll(event, "tvShows")}
            sx={{
              color: "white",
              fontSize: "24px",
              paddingY: "0px",
              paddingLeft: "10px",
              paddingRight: "8px",
              "&.Mui-checked": {
                color: "#CDDC39",
              },
              "&.MuiCheckbox-indeterminate": {
                color: "#CDDC39",
              },
            }}
          />
          <h2
            style={{
              color: "white",
              fontSize: "24px",
              marginTop: "0px",
              marginBottom: "4px",
            }}
          >
            TV Shows
          </h2>
        </div>
        <List
          style={{
            backgroundColor: "#f4f4f9",
            borderRadius: "8px",
            padding: "10px",
          }}
        >
          {tvShows.map((tvShow, idx) => {
            return (
              <ListItem key={idx}>
                <ListItemIcon>
                  <Checkbox
                    edge="start"
                    onChange={() => handleSelectClick("tvShows", idx)}
                    checked={selected.tvShows.includes(idx)}
                  />
                </ListItemIcon>
                <ListItemText primary={tvShow.Title} />
              </ListItem>
            );
          })}
        </List>
      </div>
      <div style={{ marginTop: "20px" }}>
        <div style={{ display: "flex", marginBottom: "5px" }}>
          <Checkbox
            edge="start"
            indeterminate={
              selected.games.length > 0 && selected.games.length < games.length
            }
            checked={games.length > 0 && selected.games.length === games.length}
            onChange={(event) => handleSelectAll(event, "games")}
            sx={{
              color: "white",
              fontSize: "24px",
              paddingY: "0px",
              paddingLeft: "10px",
              paddingRight: "8px",
              "&.Mui-checked": {
                color: "#CDDC39",
              },
              "&.MuiCheckbox-indeterminate": {
                color: "#CDDC39",
              },
            }}
          />
          <h2
            style={{
              color: "white",
              fontSize: "24px",
              marginTop: "0px",
              marginBottom: "4px",
            }}
          >
            Games
          </h2>
        </div>
        <List
          style={{
            backgroundColor: "#f4f4f9",
            borderRadius: "8px",
            padding: "10px",
          }}
        >
          {games.map((game, idx) => {
            return (
              <ListItem key={idx}>
                <ListItemIcon>
                  <Checkbox
                    edge="start"
                    onChange={() => handleSelectClick("games", idx)}
                    checked={selected.games.includes(idx)}
                  />
                </ListItemIcon>
                <ListItemText primary={game.Title} />
              </ListItem>
            );
          })}
        </List>
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
    </div>
  );
}
