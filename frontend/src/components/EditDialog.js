import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";

export default function EditDialog({
  open,
  onClose,
  onUpdate,
  title,
  id,
  fields,
}) {
  const [_fields, set_fields] = useState(fields || []);
  const [errorText, setErrorText] = useState("");

  const handleChange = (e, idx) => {
    set_fields((prevFields) => {
      const updatedItems = [...prevFields];
      updatedItems[idx] = { ...updatedItems[idx], value: e.target.value };
      return updatedItems;
    });

    if (e.target.value.trim()) {
      setErrorText("");
    } else {
      setErrorText("No value entered");
    }
  };

  const handleUpdate = () => {
    if (errorText) {
      alert("Invalid update values");
    } else {
      onUpdate(id, _fields);
    }
  };

  const handleClose = () => {
    setErrorText("");
    onClose();
  };

  useEffect(() => {
    set_fields(fields || []);
  }, [fields]);

  return (
    <Dialog open={open} onClose={handleClose} closeAfterTransition={false}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent dividers>
        <Stack spacing={2}>
          {_fields.map((field, idx) => (
            <TextField
              key={`field${idx}`}
              label={field.label}
              variant="outlined"
              value={field.value}
              onChange={(e) => handleChange(e, idx)}
              error={Boolean(errorText.length)}
              helperText={errorText}
            />
          ))}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleUpdate}>Update</Button>
      </DialogActions>
    </Dialog>
  );
}
