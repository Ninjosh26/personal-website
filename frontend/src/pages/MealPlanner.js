import { useEffect } from "react";
import { MealCalendar } from "../components";
import { useSampleMeals } from "../hooks/useMeals";

export default function MealPlanner() {
  const {
    recipes,
    meals,
    recipeTags,
    ingredients,
    loading,
    error,
    getMeals,
    getRecipeIngredients,
    getRecipeInstructions,
    addRecipe,
    addMeal,
    deleteRecipe,
    deleteMeal,
    updateRecipe,
    updateMeal,
  } = useSampleMeals();

  useEffect(() => {
    document.title = "Kate's Website - Meal Planner";
  }, []);

  useEffect(() => {
    if (error) {
      alert(error);
    }
  });

  return (
    <div style={{ paddingLeft: "20px", paddingRight: "20px" }}>
      <h1 style={{ color: "white" }}>Meal Planner</h1>
      {loading ? (
        "loading"
      ) : (
        <MealCalendar
          recipes={recipes}
          meals={meals}
          recipeTags={recipeTags}
          ingredients={ingredients}
          getMeals={getMeals}
          getRecipeIngredients={getRecipeIngredients}
          getRecipeInstructions={getRecipeInstructions}
          addRecipe={addRecipe}
          addMeal={addMeal}
          deleteRecipe={deleteRecipe}
          deleteMeal={deleteMeal}
          updateRecipe={updateRecipe}
          updateMeal={updateMeal}
        />
      )}
    </div>
  );
}
