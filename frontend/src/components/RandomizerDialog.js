import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";

export default function RandomizerDialog({
  movies,
  tvShows,
  games,
  selected,
  handleSelectClick,
  handleSelectAll,
  isOpen,
  onClose,
}) {
  const randomizeSelection = () => {
    const totalSelected =
      selected.movies.length + selected.tvShows.length + selected.games.length;
    if (totalSelected > 0) {
      const randomNum = Math.floor(Math.random() * totalSelected);
      let randomItem;
      let category;

      if (randomNum < selected.movies.length) {
        randomItem = movies[selected.movies[randomNum]];
        category = "MOVIE";
      } else if (randomNum < selected.movies.length + selected.tvShows.length) {
        randomItem =
          tvShows[selected.tvShows[randomNum - selected.movies.length]];
        category = "TV SHOW";
      } else {
        randomItem = games[selected.games[totalSelected - randomNum - 1]];
        category = "GAME";
      }

      alert(`Randomly selected ${category}: ${randomItem.Title}`);
    } else {
      alert("No items selected!");
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Randomly Select an Activity</DialogTitle>
      <DialogContent>
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
            <Typography variant="body1" style={{ marginBottom: "5px" }}>
              Movies
            </Typography>
          </div>
          <List
            dense
            style={{
              backgroundColor: "#f4f4f9",
              borderRadius: "8px",
              padding: "10px",
              maxHeight: "150px",
              overflowY: "auto",
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
            <Typography variant="body1" style={{ marginBottom: "5px" }}>
              TV Shows
            </Typography>
          </div>
          <List
            dense
            style={{
              backgroundColor: "#f4f4f9",
              borderRadius: "8px",
              padding: "10px",
              maxHeight: "150px",
              overflowY: "auto",
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
                selected.games.length > 0 &&
                selected.games.length < games.length
              }
              checked={
                games.length > 0 && selected.games.length === games.length
              }
              onChange={(event) => handleSelectAll(event, "games")}
              sx={{
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
            <Typography variant="body1" style={{ marginBottom: "5px" }}>
              Games
            </Typography>
          </div>
          <List
            dense
            style={{
              backgroundColor: "#f4f4f9",
              borderRadius: "8px",
              padding: "10px",
              maxHeight: "150px",
              overflowY: "auto",
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
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
        <Button
          onClick={randomizeSelection}
          variant="contained"
          color="primary"
        >
          Randomize
        </Button>
      </DialogActions>
    </Dialog>
  );
}
