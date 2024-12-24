import {
  Box,
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
  TableSortLabel,
  Tooltip,
} from "@mui/material";
import { visuallyHidden } from "@mui/utils";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import { useEffect, useRef, useState } from "react";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
    fontSize: 18,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 18,
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

const StyledTableSortLabel = styled(TableSortLabel)(({ theme }) => ({
  color: theme.palette.common.white,
  "&.Mui-active": {
    color: theme.palette.common.white,
  },
  "&:hover": {
    color: theme.palette.common.white,
  },
  "& .MuiTableSortLabel-icon": {
    color: theme.palette.common.white,
  },
  "&.Mui-active .MuiTableSortLabel-icon": {
    color: theme.palette.common.white,
  },
}));

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  } else if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => descendingComparator(b, a, orderBy);
}

export default function ActivityTable({
  activities,
  category,
  selected,
  handleSelectClick,
  handleSelectAll,
  handleEdit,
  triggerScroll,
}) {
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState(null);
  const [highlight, setHighlight] = useState(null);
  const lastRowRef = useRef(null);

  useEffect(() => {
    if (triggerScroll === category && lastRowRef.current) {
      lastRowRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });

      setHighlight(activities.length - 1);

      // Remove the highlight after 2 seconds
      const timeout = setTimeout(() => {
        setHighlight(null);
      }, 1000);
      return () => clearTimeout(timeout);
    }
  }, [triggerScroll, activities, category]);

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

  const handleSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
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
            <StyledTableCell
              sortDirection={orderBy === "Title" ? order : false}
            >
              <StyledTableSortLabel
                active={orderBy === "Title"}
                direction={orderBy === "Title" ? order : "asc"}
                onClick={(event) => handleSort(event, "Title")}
              >
                Name
                {orderBy === "Title" ? (
                  <Box component="span" sx={visuallyHidden}>
                    {order === "desc"
                      ? "sorted-descending"
                      : "sorted-ascending"}
                  </Box>
                ) : null}
              </StyledTableSortLabel>
            </StyledTableCell>
            <StyledTableCell
              align="center"
              sortDirection={orderBy === "CreatedAt" ? order : false}
            >
              <StyledTableSortLabel
                active={orderBy === "CreatedAt"}
                direction={orderBy === "CreatedAt" ? order : "asc"}
                onClick={(event) => handleSort(event, "CreatedAt")}
              >
                Date Added
                {orderBy === "CreatedAt" ? (
                  <Box component="span" sx={visuallyHidden}>
                    {order === "desc"
                      ? "sorted-descending"
                      : "sorted-ascending"}
                  </Box>
                ) : null}
              </StyledTableSortLabel>
            </StyledTableCell>
            <StyledTableCell
              align="center"
              sortDirection={orderBy === "UpdatedAt" ? order : false}
            >
              <StyledTableSortLabel
                active={orderBy === "UpdatedAt"}
                direction={orderBy === "UpdatedAt" ? order : "asc"}
                onClick={(event) => handleSort(event, "UpdatedAt")}
              >
                Last Updated
                {orderBy === "UpdatedAt" ? (
                  <Box component="span" sx={visuallyHidden}>
                    {order === "desc"
                      ? "sorted-descending"
                      : "sorted-ascending"}
                  </Box>
                ) : null}
              </StyledTableSortLabel>
            </StyledTableCell>
            <StyledTableCell align="center">Edit</StyledTableCell>
          </StyledTableRow>
        </TableHead>
        <TableBody sx={{ maxHeight: "70vh" }}>
          {activities
            .sort(getComparator(order, orderBy))
            .map((activity, idx) => (
              <StyledTableRow
                key={idx}
                ref={idx === activities.length - 1 ? lastRowRef : null}
                sx={{ "& > *": { borderBottom: "unset" } }}
                style={{
                  transition: "background-color 0.5s",
                  backgroundColor: idx === highlight ? "#9beffa" : "",
                }}
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
