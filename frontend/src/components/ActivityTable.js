import {
  Checkbox,
  IconButton,
  Paper,
  styled,
  Table,
  TableBody,
  TableCell,
  tableCellClasses,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
} from "@mui/material";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

export default function ActivityTable({
  activities,
  category,
  selected,
  handleSelectClick,
  handleSelectAll,
  handleEdit,
}) {
  const prettyTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const options = {
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      timeZoneName: "short",
    };
    return date.toLocaleString("en-US", options);
  };

  return (
    <TableContainer
      component={Paper}
      sx={{ maxWidth: "100vw", maxHeight: 500 }}
    >
      <Table size="small" aria-label="activity table" stickyHeader>
        <colgroup>
          <col style={{ width: "10%" }} />
          <col style={{ width: "30%" }} />
          <col style={{ width: "25%" }} />
          <col style={{ width: "25%" }} />
          <col style={{ width: "10%" }} />
        </colgroup>
        <TableHead>
          <StyledTableRow>
            <StyledTableCell>
              <Tooltip title="Select All">
                <Checkbox
                  edge="start"
                  indeterminate={
                    selected[category].length > 0 &&
                    selected[category].length < activities.length
                  }
                  checked={
                    activities.length > 0 &&
                    selected[category].length === activities.length
                  }
                  onChange={(event) => handleSelectAll(event, category)}
                  sx={{
                    color: "white",
                    fontSize: "24px",
                    "&.Mui-checked": { color: "#cddc39" },
                    "&.MuiCheckbox-indeterminate": { color: "#cddc39" },
                  }}
                />
              </Tooltip>
            </StyledTableCell>
            <StyledTableCell>Name</StyledTableCell>
            <StyledTableCell align="center">Date Added</StyledTableCell>
            <StyledTableCell align="center">Last Updated</StyledTableCell>
            <StyledTableCell align="center">Edit</StyledTableCell>
          </StyledTableRow>
        </TableHead>
        <TableBody sx={{ maxHeight: "70vh" }}>
          {activities.map((activity, idx) => (
            <StyledTableRow
              key={idx}
              sx={{ "& > *": { borderBottom: "unset" } }}
            >
              <StyledTableCell>
                <Checkbox
                  edge="start"
                  onChange={() => handleSelectClick(category, idx)}
                  checked={selected[category].includes(idx)}
                />
              </StyledTableCell>
              <StyledTableCell component="th" scope="row">
                {activity.Title}
              </StyledTableCell>
              <StyledTableCell align="center">
                {prettyTimestamp(activity.CreatedAt)}
              </StyledTableCell>
              <StyledTableCell align="center">
                {prettyTimestamp(activity.UpdatedAt)}
              </StyledTableCell>
              <StyledTableCell align="center">
                <IconButton
                  sx={{ backgroundColor: "#d7e7ff", borderRadius: "5px" }}
                  onClick={() => handleEdit(activity, category)}
                >
                  <DriveFileRenameOutlineIcon sx={{ color: "black" }} />
                </IconButton>
              </StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
