import "./styles/MealCalendar.css";
import { useEffect, useState } from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import ViewDialog from "./ViewDialog";
import { Button, IconButton, Tooltip } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

export const mealTypes = {
  breakfast: "Breakfast",
  lunch: "Lunch",
  snack: "Snack",
  dinner: "Dinner",
};

const sampleRecipes = [
  {
    MealId: 1,
    Name: "Chicken Alfredo",
    Ingredients: [
      "Fettuccine",
      "Heavy Cream",
      "Butter",
      "Garlic",
      "Chicken",
      "Parmesan",
    ],
    Instructions: [
      "Cook fettuccine",
      "Cook chicken",
      "Heat butter and garlic, add cream, then stir in parmesan",
      "Toss with pasta and serve",
    ],
  },
  {
    MealId: 2,
    Name: "Greek Salad",
    Ingredients: [
      "Romaine Lettuce",
      "Cucumbers",
      "Tomatoes",
      "Red Onion",
      "Feta",
      "Olives",
      "Olive Oil",
    ],
    Instructions: [
      "Chop vegetables and mix with olives",
      "Drizzle with olive oil and sprinkle oregano",
      "Top with crumbled feta",
    ],
  },
  {
    MealId: 3,
    Name: "Butter Chicken",
    Ingredients: [
      "Chicken",
      "Butter",
      "Tomatoes",
      "Cream",
      "Garlic",
      "Ginger",
      "Garam Masala",
    ],
    Instructions: [
      "Marinate chicken with spices",
      "Cook in butter, add tomato puree and cream",
      "Simmer and serve with naan or rice",
    ],
  },
];

const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const mealTypes = [
  { MealTypeId: 1, Name: "Breakfast" },
  { MealTypeId: 2, Name: "Lunch" },
  { MealTypeId: 3, Name: "Snack" },
  { MealTypeId: 4, Name: "Dinner" },
];

const dictionaryMeals = sampleRecipes.reduce((acc, meal, idx) => {
  const key = `recipe${idx + 1}`;
  acc[key] = {
    id: key,
    Location: "recipes",
    ...meal,
  };

  return acc;
}, {});

// Unique ID generator to keep all draggable items unique
const uniqueId = (length = 16) => {
  return Math.ceil(Math.random() * Date.now())
    .toPrecision(length)
    .toString()
    .replace(".", "");
};

// Colors for categories (might change with themes)
const categoryColors = [
  { dark: "#2f9ff7", light: "#7dc5ff" },
  { dark: "#52e3c3", light: "#a1f0de" },
  { dark: "#a572f2", light: "#c3a2f5" },
  { dark: "#f56eb8", light: "#fa9bcf" },
  { dark: "#f5a873", light: "#fabe93" },
];

// Automatically apply opacity to a hex color string
function applyOpacity(color, opacity) {
  const value = Math.floor(opacity * 255).toString(16);
  return color + value;
}

function Droppable({ id, children }) {
  const { isOver, setNodeRef } = useDroppable({
    id: id,
  });

  return (
    <div
      ref={setNodeRef}
      style={{
        backgroundColor: isOver ? "#f0ebeb" : undefined,
        width: "100%",
        height: "100%",
      }}
    >
      {children}
    </div>
  );
}

function Draggable({ meal, onDoubleClick, children }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: meal.id,
  });
  const [hover, setHover] = useState(false);

  const color =
    meal.Location === "recipes"
      ? "#eeeeee"
      : categoryColors[
          (meal.Location.split("-")[1] - 1) % categoryColors.length
        ].light;

  return (
    // Wrap in padded container to put gaps between draggables without altering surrouding cells
    <div
      ref={setNodeRef}
      style={{
        paddingTop: "5px",
        paddingBottom: "5px",
      }}
      {...listeners}
      {...attributes}
    >
      <div
        style={{
          width: "190px",
          backgroundColor: applyOpacity(color, hover ? 1 : 0.75),
          paddingTop: "10px",
          paddingBottom: "10px",
          borderRadius: "5px",
          boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
          textAlign: "center",
          cursor: "pointer",
          visibility: isDragging ? "hidden" : undefined,
        }}
        onDoubleClick={onDoubleClick}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        {children}
      </div>
    </div>
  );
}

export default function MealCalendar() {
  const [recipes, setRecipes] = useState(dictionaryMeals);
  const [meals, setMeals] = useState(dictionaryMeals);
  const [activeId, setActiveId] = useState(null);
  const [viewRecipe, setViewRecipe] = useState(false);
  const [recipeFields, setRecipeFields] = useState([]);
  const [currentWeek, setCurrentWeek] = useState([]);

  // Get the current day
  useEffect(() => {
    setCurrentWeek(getWeek(new Date()));
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 0.01,
      },
    })
  );

  const getWeek = (date) => {
    // Calculate the start of the week (Sunday)
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - date.getDay());

    // Generate all dates in the week
    const week = [];
    for (let i = 0; i < 7; i++) {
      const weekDate = new Date(startOfWeek);
      weekDate.setDate(startOfWeek.getDate() + i);
      week.push(weekDate);
    }

    console.log(week);

    return week;
  };

  const isSameDay = (date1, date2) => {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  };

  const undraggableMarkup = (item) => {
    const color =
      categoryColors[(item.Location.split("-")[1] - 1) % categoryColors.length]
        .light;

    return (
      <div key={item.id} style={{ paddingTop: "5px", paddingBottom: "5px" }}>
        <div
          style={{
            width: "190px",
            backgroundColor: applyOpacity(color, 0.3),
            paddingTop: "10px",
            paddingBottom: "10px",
            borderRadius: "5px",
            boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1",
            textAlign: "center",
          }}
        >
          {item.Name}
        </div>
      </div>
    );
  };

  const draggableMarkup = (item) => (
    <Draggable
      key={item.id}
      meal={item}
      onDoubleClick={() => {
        // Extract recipe fields to display
        const { Name, Ingredients, Instructions } = item;
        setRecipeFields([
          {
            label: "Name",
            value: Name,
          },
          {
            label: "Ingredients",
            value: Ingredients,
            display: "accordian",
          },
          {
            label: "Instructions",
            value: Instructions,
            display: "numberedAccordian",
          },
        ]);
        setViewRecipe(true);
      }}
    >
      {item.Name}
    </Draggable>
  );

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event) => {
    const { over, active } = event;
    setActiveId(null);

    setMeals((prevMeals) => {
      // Copy available meal to calendar
      if (active.id.startsWith("recipe") && over) {
        const newId = uniqueId();
        return {
          ...prevMeals,
          [newId]: {
            ...prevMeals[active.id],
            id: newId,
            Location: over.id,
          },
        };
      }

      // Delete meal if moved off calendar
      if (!active.id.startsWith("recipe") && !over) {
        const { [active.id]: _, ...updatedMeals } = prevMeals;
        return updatedMeals;
      }

      // Otherwise, standard move
      return {
        ...prevMeals,
        [active.id]: {
          ...prevMeals[active.id],
          Location: over ? over.id : "recipes",
        },
      };
    });
  };

  const handlePreviousWeek = () => {
    const startOfPrevWeek = new Date(currentWeek[0]);
    startOfPrevWeek.setDate(startOfPrevWeek.getDate() - 7);
    setCurrentWeek(getWeek(startOfPrevWeek));
  };

  const handleCurrentWeek = () => {
    setCurrentWeek(getWeek(new Date()));
  };

  const handleNextWeek = () => {
    const startOfNextWeek = new Date(currentWeek[0]);
    startOfNextWeek.setDate(startOfNextWeek.getDate() + 7);
    setCurrentWeek(getWeek(startOfNextWeek));
  };

  return (
    <DndContext
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      sensors={sensors}
    >
      <div
        style={{
          display: "flex",
          gap: "20px",
          paddingLeft: "20px",
          paddingRight: "20px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: "20vw",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <h2>Recipes</h2>
            <Tooltip title="Add a New Activity">
              <Button
                variant="contained"
                onClick={() => {}}
                style={{
                  height: "40px",
                  padding: "0 20px",
                  borderRadius: "4px",
                  backgroundColor: "#333",
                }}
              >
                Add
              </Button>
            </Tooltip>
          </div>
          {Object.values(recipes).map((recipe) =>
            recipe.Location === "recipes" ? draggableMarkup(recipe) : null
          )}
        </div>
        <div style={{ flex: 1 }}>
          <h2>Weekly Calendar</h2>
          <div className="meal-grid">
            <div className="header-row">
              <div className="header-cell navigation">
                <Tooltip title="Go to the previous week">
                  <IconButton
                    aria-label="previous week"
                    onClick={handlePreviousWeek}
                    sx={{ color: "white" }}
                  >
                    <ArrowBackIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Go to the current week">
                  <Button
                    variant="contained"
                    onClick={handleCurrentWeek}
                    style={{
                      height: "20px",
                      padding: "0 20px",
                      borderRadius: "4px",
                      backgroundColor: "white",
                      color: "black",
                    }}
                  >
                    Today
                  </Button>
                </Tooltip>
                <Tooltip title="Go to the next week">
                  <IconButton
                    aria-label="next week"
                    onClick={handleNextWeek}
                    sx={{ color: "white" }}
                  >
                    <ArrowForwardIcon />
                  </IconButton>
                </Tooltip>
              </div>
              {currentWeek.map((day) => {
                const isToday = day && isSameDay(day, new Date());
                return (
                  <div
                    key={day.getDate()}
                    className={`header-cell${
                      isToday ? " highlight-header" : ""
                    }`}
                  >
                    <div>{days[day.getDay()]}</div>
                    <div>
                      {`${String(day.getMonth() + 1).padStart(2, "0")}/${String(
                        day.getDate()
                      ).padStart(2, "0")}/${day.getFullYear()}`}
                    </div>
                  </div>
                );
              })}
            </div>
            {mealTypes.map((mealType) => (
              <div key={mealType.MealTypeId} className="row">
                <div
                  className="cell row-header"
                  style={{
                    color:
                      categoryColors[
                        (mealType.MealTypeId - 1) % categoryColors.length
                      ].dark,
                  }}
                >
                  {mealType.Name}
                </div>
                {days.map((day, idx) => {
                  const dropId = `${day}-${mealType.MealTypeId}`;
                  const assignedItems = Object.values(meals).filter(
                    (meal) => meal.Location === dropId
                  );
                  const date = currentWeek[idx];
                  const isToday = date && isSameDay(date, new Date());
                  const isPast = date < new Date().setHours(0, 0, 0, 0);

                  return (
                    <div
                      key={dropId}
                      className={`cell${isToday ? " highlight" : ""}${
                        isPast ? " disabled" : ""
                      }`}
                    >
                      {isPast ? (
                        <div className="droppable">
                          {assignedItems.length > 0
                            ? assignedItems.map((item) =>
                                undraggableMarkup(item)
                              )
                            : null}
                        </div>
                      ) : (
                        <Droppable key={dropId} id={dropId}>
                          <div className="droppable">
                            {assignedItems.length > 0
                              ? assignedItems.map((item) =>
                                  draggableMarkup(item)
                                )
                              : null}
                          </div>
                        </Droppable>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
      <DragOverlay>
        {activeId ? (
          <div
            style={{
              padding: "10px",
              backgroundColor:
                meals[activeId].Location === "recipes"
                  ? "#eeeeee"
                  : categoryColors[
                      meals[activeId].Location.split("-")[1] %
                        categoryColors.length
                    ].light,
              borderRadius: "5px",
              boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
              textAlign: "center",
            }}
          >
            {meals[activeId]?.Name || "Dragging..."}
          </div>
        ) : null}
      </DragOverlay>
      <ViewDialog
        open={viewRecipe}
        onClose={() => setViewRecipe(false)}
        title={recipeFields[0]?.value}
        fields={recipeFields}
      />
    </DndContext>
  );
}
