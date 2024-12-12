import {
  Box,
  Button,
  Dialog,
  DialogContent,
  Fade,
  Grid2,
  IconButton,
  Typography,
} from "@mui/material";
import { forwardRef } from "react";

const Transition = forwardRef(function Transition(props, ref) {
  return <Fade ref={ref} {...props} />;
});

export default function ConfirmDialog({ isOpen, onClose, title, dialogBody }) {
  return (
    <Dialog
      fullWidth
      open={isOpen}
      maxWidth="md"
      scroll="body"
      onClose={onClose}
      TransitionComponent={Transition}
    >
      <DialogContent sx={{ px: 8, py: 6, position: "relative" }}>
        <IconButton
          size="medium"
          onClick={() => onClose({}, "close-clicked")}
          sx={{ position: "absolute", right: "5px", top: "5px" }}
        >
          X
        </IconButton>
        <Grid2 container spacing={6}>
          <Grid2 xs={12}>
            <Box
              sx={{
                mb: 3,
                display: "flex",
                justifyContent: "flex-start",
                flexDirection: "column",
              }}
            >
              <Typography variant="h5">{title}</Typography>
              {dialogBody}
            </Box>
          </Grid2>
          <Grid2
            xs={12}
            sx={{
              position: "absolute",
              bottom: 30,
              right: 30,
              display: "flex",
              gap: "1rem",
            }}
          >
            <Button
              size="medium"
              variant="contained"
              color="primary"
              onClick={() => onClose({}, "cancel-clicked")}
            >
              Cancel
            </Button>
            <Button
              size="medium"
              variant="contained"
              color="error"
              onClick={() => onClose({}, "delete-clicked")}
            >
              Delete
            </Button>
          </Grid2>
        </Grid2>
      </DialogContent>
    </Dialog>
  );
}
