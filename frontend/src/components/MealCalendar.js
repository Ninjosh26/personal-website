import "./styles/MealCalendar.css";
import { useState } from "react";
import {
  DndContext,
  DragOverlay,
  useDraggable,
  useDroppable,
} from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";

function Droppable({ id, children }) {
  const { isOver, setNodeRef } = useDroppable({
    id: id,
  });

  return (
    <div ref={setNodeRef} style={{ color: isOver ? "green" : undefined }}>
      {children}
    </div>
  );
}

function Draggable({ id, children }) {
  const { attributes, listeners, setNodeRef, isDragging, transform } =
    useDraggable({
      id: id,
    });

  return (
    <button
      ref={setNodeRef}
      style={{
        width: "100px",
        opacity: isDragging ? 0.75 : 1,
        zIndex: 2,
        transform: CSS.Translate.toString(transform),
      }}
      {...listeners}
      {...attributes}
    >
      {children}
    </button>
  );
}

function applyOpacity(color, opacity) {
  const value = Math.floor(opacity * 255).toString(16);
  return color + value;
}

const initialMeals = [
  { MealId: 1, Name: "Pasta", Location: "available" },
  { MealId: 2, Name: "Salad", Location: "available" },
  { MealId: 3, Name: "Chicken Curry", Location: "available" },
];

const dictionaryMeals = initialMeals.reduce((acc, meal, idx) => {
  const key = `sample${idx + 1}`;
  acc[key] = {
    id: key,
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

export default function MealCalendar() {
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const mealTypes = ["Breakfast", "Lunch", "Snack", "Dinner"];
  const [availableMeals, setAvailableMeals] = useState(dictionaryMeals);
  const [meals, setMeals] = useState(dictionaryMeals);
  const [activeId, setActiveId] = useState(null);

  const draggableMarkup = (item) => (
    <Draggable
      key={item.id}
      id={item.id}
      // style={{ backgroundColor: applyOpacity("#69169c", 0.3 ) }}
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
      if (active.id.startsWith("sample") && over) {
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
      if (!active.id.startsWith("sample") && !over) {
        const { [active.id]: _, ...updatedMeals } = prevMeals;
        return updatedMeals;
      }

      // Otherwise, standard move
      return {
        ...prevMeals,
        [active.id]: {
          ...prevMeals[active.id],
          Location: over ? over.id : "available",
        },
      };
    });
  };

  return (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div style={{ display: "flex", gap: "20px" }}>
        <div style={{ display: "flex", flexDirection: "column", width: "30%" }}>
          <h2>Available Meals</h2>
          {Object.values(availableMeals).map((meal) =>
            meal.Location === "available" ? draggableMarkup(meal) : null
          )}
        </div>
        <div style={{ flex: 1, width: "70%" }}>
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
              <div key={mealType} className="row">
                <div className="cell row-header">{mealType}</div>
                {days.map((day) => {
                  const dropId = `${day}-${mealType}`;
                  const assignedItems = Object.values(meals).filter(
                    (meal) => meal.Location === dropId
                  );
                  return (
                    <div key={dropId} className="cell">
                      <Droppable key={dropId} id={dropId}>
                        <div
                          style={{
                            minHeight: "100px",
                          }}
                        >
                          {assignedItems.length > 0
                            ? assignedItems.map((item) => draggableMarkup(item))
                            : "Drop here"}
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
              backgroundColor: "#ccc",
              borderRadius: "5px",
              boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
            }}
          >
            {meals[activeId]?.Name || "Dragging..."}
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
