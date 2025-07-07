import "./styles/MealCalendar.css";
import { useCallback, useEffect, useState } from "react";
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

const mealTypes = {
  breakfast: "Breakfast",
  lunch: "Lunch",
  snack: "Snack",
  dinner: "Dinner",
};

const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

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

// Droppable component
function Droppable({ id, children }) {
  const { isOver, setNodeRef } = useDroppable({
    id: id,
  });

  return (
    <div
      ref={setNodeRef}
      style={{
        backgroundColor: isOver ? "#f0ebeb" : undefined,
        height: "100%",
        width: "100%",
      }}
    >
      {children}
    </div>
  );
}

// Draggable component
function Draggable({ id, color, onDoubleClick, children }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: id,
  });
  const [hover, setHover] = useState(false);

  return (
    // Wrap in padded container to put gaps between draggables without altering surrounding cells
    <div
      ref={setNodeRef}
      style={{ paddingTop: "5px", paddingBottom: "5px" }}
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

export default function MealCalendar({
  recipes,
  meals,
  recipeTags,
  ingredients,
  getMeals,
  getRecipeIngredients,
  getRecipeInstructions,
  addRecipe,
  addMeal,
  deleteRecipe,
  deleteMeal,
  updateRecipe,
  updateMeal,
}) {
  const [activeDrag, setActiveDrag] = useState(null);
  const [viewRecipe, setViewRecipe] = useState(false);
  const [currentWeek, setCurrentWeek] = useState([]);
  const [recipeFields, setRecipeFields] = useState([]);

  // Generate the list of dates for the week 'date' is in
  const getWeek = useCallback((date) => {
    // Calculate the start of the week (Sunday)
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - date.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    // Generate all dates in the week
    const week = [];
    for (let i = 0; i < 7; i++) {
      const weekDate = new Date(startOfWeek);
      weekDate.setDate(startOfWeek.getDate() + i);
      week.push(weekDate);
    }

    return week;
  }, []);

  const handleCurrentWeek = useCallback(() => {
    const week = getWeek(new Date());
    setCurrentWeek(week);
    getMeals(week[0]);
  }, [getWeek, setCurrentWeek, getMeals]);

  // Initialize with the current day
  useEffect(() => {
    handleCurrentWeek();
  }, [handleCurrentWeek]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 0.01,
      },
    })
  );

  const isSameDay = (date1, date2) => {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  };

  // Component for undraggable meal
  const undraggableMarkup = (id) => {
    const [location, recipeId] = id.split("-");
    const color =
      categoryColors[Math.floor(location / 7) % categoryColors.length].light;

    return (
      <div
        key={`undraggable-${id}`}
        style={{ paddingTop: "5px", paddingBottom: "5px" }}
      >
        <div
          style={{
            width: "190px",
            backgroundColor: applyOpacity(color, 0.3),
            paddingTop: "10px",
            paddingBottom: "10px",
            borderRadius: "5px",
            boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
            textAlign: "center",
          }}
        >
          {recipes[recipeId].Name}
        </div>
      </div>
    );
  };

  // Component for draggable meal
  const draggableMarkup = (id, recipe) => {
    const [location] = id.split("-");
    const color =
      location === "recipe"
        ? "#eeeeee"
        : categoryColors[Math.floor(location / 7) % categoryColors.length]
            .light;
    return (
      <Draggable
        id={id}
        key={`draggable-${id}`}
        color={color}
        onDoubleClick={async () => {
          // Extract recipe fields to display
          const { RecipeId, Name } = recipe;
          const ingrs = await getRecipeIngredients(RecipeId);
          const instructions = await getRecipeInstructions(RecipeId);
          setRecipeFields([
            {
              label: "Name",
              value: Name,
            },
            {
              label: "Ingredients",
              value: ingrs.map(
                (ingr) =>
                  `${ingr.Amount} - ${ingredients[ingr.IngredientId].Name}`
              ),
              display: "accordian",
            },
            {
              label: "Instructions",
              value: instructions,
              display: "numberedAccordian",
            },
          ]);
          setViewRecipe(true);
        }}
      >
        {recipe.Name}
      </Draggable>
    );
  };

  const handleDragStart = (event) => {
    const [location, recipeId] = event.active.id.split("-");
    setActiveDrag({
      location,
      recipe: recipes[recipeId],
    });
  };

  const handleDragEnd = (event) => {
    const { over, active } = event;
    const [dropSlot] = over ? over.id.split("-") : [0, 0];
    const [dragSlot, recipeId, mealId] = active.id.split("-");
    setActiveDrag(null);

    // Insert meal into calendar
    if (dragSlot === "recipe" && over) {
      addMeal(recipeId, currentWeek[dropSlot % 7], Math.floor(dropSlot / 7));
    }

    if (dragSlot !== "recipe") {
      const mealType = Math.floor(dropSlot / 7);
      const mealSlot = meals[Math.floor(dragSlot / 7)][dragSlot % 7];
      const mealIdx = mealSlot.findIndex(
        (meal) => meal.MealId === parseInt(mealId)
      );

      if (over) {
        // Change location of meal
        updateMeal(mealSlot[mealIdx], currentWeek[dropSlot % 7], mealType);
      } else {
        // Delete meal if moved off calendar
        deleteMeal(mealSlot[mealIdx]);
      }
    }
  };

  const handlePreviousWeek = () => {
    const startOfPrevWeek = new Date(currentWeek[0]);
    startOfPrevWeek.setDate(startOfPrevWeek.getDate() - 7);
    setCurrentWeek(getWeek(startOfPrevWeek));
    getMeals(startOfPrevWeek);
  };

  const handleNextWeek = () => {
    const startOfNextWeek = new Date(currentWeek[0]);
    startOfNextWeek.setDate(startOfNextWeek.getDate() + 7);
    setCurrentWeek(getWeek(startOfNextWeek));
    getMeals(startOfNextWeek);
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
            <Tooltip title="Add a New Recipe">
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
            draggableMarkup(`recipe-${recipe.RecipeId}`, recipe)
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
              {currentWeek.map((day, idx) => {
                const isToday = day && isSameDay(day, new Date());
                return (
                  <div
                    key={`day-${idx}`}
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
            {Object.values(mealTypes).map((mealType, idx) => (
              <div key={`mealType-${idx}`} className="row">
                <div
                  className="cell row-header"
                  style={{
                    color: categoryColors[idx % categoryColors.length].dark,
                  }}
                >
                  {mealType}
                </div>
                {currentWeek.map((day, dayNum) => {
                  const slotNum = idx * 7 + dayNum;
                  const dropId = `${slotNum}-slot`;
                  const assignedItems = meals[idx][day.getDay()];
                  const isToday = day && isSameDay(day, new Date());
                  const isPast = day < new Date().setHours(0, 0, 0, 0);

                  return (
                    <div
                      key={`mealSlot-${dropId}`}
                      className={`cell${isToday ? " highlight" : ""}${
                        isPast ? " disabled" : ""
                      }`}
                    >
                      {isPast ? (
                        <div
                          className="droppable"
                          key={`undroppable-${dropId}`}
                        >
                          {assignedItems.length > 0
                            ? assignedItems.map((item) =>
                                undraggableMarkup(
                                  `${slotNum}-${item.RecipeId}-${item.MealId}`
                                )
                              )
                            : null}
                        </div>
                      ) : (
                        <Droppable id={dropId} key={`droppable-${dropId}`}>
                          <div className="droppable">
                            {assignedItems.length > 0
                              ? assignedItems.map((item) =>
                                  draggableMarkup(
                                    `${slotNum}-${item.RecipeId}-${item.MealId}`,
                                    recipes[item.RecipeId]
                                  )
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
        {activeDrag ? (
          <div
            style={{
              padding: "10px",
              backgroundColor:
                activeDrag.location === "recipe"
                  ? "#eeeeee"
                  : categoryColors[
                      Math.floor(activeDrag.location / 7) %
                        categoryColors.length
                    ].light,
              borderRadius: "5px",
              boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
              textAlign: "center",
            }}
          >
            {activeDrag.recipe.Name}
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
