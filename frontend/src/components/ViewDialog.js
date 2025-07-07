import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  List,
  ListItem,
  ListItemText,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

export default function ViewDialog({ open, onClose, title, fields }) {
  const getTextField = (id, field) => (
    <TextField
      key={`field${id}`}
      label={field.label}
      variant="outlined"
      value={field.value}
      slotProps={{
        input: {
          readOnly: true,
        },
      }}
    />
  );

  const getText = (id, field) => (
    <Typography key={`field${id}`} variant="h5" component="div" gutterBottom>
      {field.value}
    </Typography>
  );

  const getAccordian = (id, field, numbered = false) => (
    <Accordion key={`field${id}`}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="h6">{field.label}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <List>
          {field.value.map((item, idx) => (
            <ListItem key={idx}>
              <ListItemText primary={(numbered ? idx + 1 + ". " : "") + item} />
            </ListItem>
          ))}
        </List>
      </AccordionDetails>
    </Accordion>
  );

  const getFieldComponent = (id, field) => {
    switch (field.display) {
      case "textField":
        return getTextField(id, field);
      case "text":
        return getText(id, field);
      case "accordian":
        return getAccordian(id, field);
      case "numberedAccordian":
        return getAccordian(id, field, true);
      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onClose={onClose} closeAfterTransition={false}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent dividers>
        <Stack spacing={2}>
          {fields && fields.map((field, idx) => getFieldComponent(idx, field))}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}
