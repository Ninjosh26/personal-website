import "./styles/MealCalendar.css";
import { useState } from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import ViewDialog from "./ViewDialog";

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
  { dark: "#2f9ff7", light: "#c6def1" },
  { dark: "#52e3c3", light: "#c9e4de" },
  { dark: "#a572f2", light: "#dbcdf0" },
  { dark: "#f2cb63", light: "#faedcb" },
  { dark: "#f56eb8", light: "#f2c6de" },
  { dark: "#f5a873", light: "#f7d9c4" },
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
  const { attributes, listeners, setNodeRef, isDragging, transform } =
    useDraggable({
      id: meal.id,
    });
  const [hover, setHover] = useState(false);

  const color =
    meal.Location === "recipes"
      ? "#eeeeee"
      : categoryColors[meal.Location.split("-")[1] % categoryColors.length]
          .light;

  return (
    <div
      ref={setNodeRef}
      style={{
        width: "8vw",
        padding: "10px",
        backgroundColor: applyOpacity(color, hover ? 1 : 0.75),
        borderRadius: "5px",
        boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
        transform: CSS.Translate.toString(transform),
        textAlign: "center",
        cursor: "pointer",
      }}
      onDoubleClick={onDoubleClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      {...listeners}
      {...attributes}
    >
      {children}
    </div>
  );
}

// function CalendarSlot({ day, mealType, meals }) {
//   const [hover, setHover] = useState(false);

//   const dropId = `${day}-${mealType.MealTypeId}`;
//   const assignedItems = Object.values(meals).filter(
//     (meal) => meal.Location === dropId
//   );

//   return (
//     <div key={dropId} className="cell">
//       <Droppable key={dropId} id={dropId}>
//         <div
//           style={{ minHeight: "100px", width: "100%", justifyItems: "center" }}
//         >
//           {assignedItems.length > 0
//             ? assignedItems.map((item) => draggableMarkup(item))
//             : null}
//         </div>
//       </Droppable>
//     </div>
//   );
// }

export default function MealCalendar() {
  const [recipes, setRecipes] = useState(dictionaryMeals);
  const [meals, setMeals] = useState(dictionaryMeals);
  const [activeId, setActiveId] = useState(null);
  const [viewRecipe, setViewRecipe] = useState(false);
  const [recipeFields, setRecipeFields] = useState([]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 0.01,
      },
    })
  );

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
          <h2>Recipes</h2>
          {Object.values(recipes).map((recipe) =>
            recipe.Location === "recipes" ? draggableMarkup(recipe) : null
          )}
        </div>
        <div style={{ flex: 1 }}>
          <h2>Weekly Calendar</h2>
          <div className="meal-grid">
            <div className="header-row">
              <div className="header-cell empty"></div>
              {days.map((day) => (
                <div key={day} className="header-cell">
                  {day}
                </div>
              ))}
            </div>
            {mealTypes.map((mealType) => (
              <div key={mealType.MealTypeId} className="row">
                <div
                  className="cell row-header"
                  style={{
                    color:
                      categoryColors[
                        mealType.MealTypeId % categoryColors.length
                      ].dark,
                  }}
                >
                  {mealType.Name}
                </div>
                {days.map((day) => {
                  const dropId = `${day}-${mealType.MealTypeId}`;
                  const assignedItems = Object.values(meals).filter(
                    (meal) => meal.Location === dropId
                  );

                  return (
                    <div key={dropId} className="cell">
                      <Droppable key={dropId} id={dropId}>
                        <div
                          style={{
                            minHeight: "100px",
                            width: "100%",
                            justifyItems: "center",
                          }}
                        >
                          {assignedItems.length > 0
                            ? assignedItems.map((item) => draggableMarkup(item))
                            : null}
                        </div>
                      </Droppable>
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
