import { useEffect } from "react";
import { MealCalendar } from "../components";

export default function MealPlanner() {
  useEffect(() => {
    document.title = "Kate's Website - Meal Planner";
  }, []);

  return (
    <div style={{ paddingLeft: "20px", paddingRight: "20px" }}>
      <h1 style={{ color: "white" }}>Meal Planner</h1>
      <MealCalendar />
    </div>
  );
}
