import { useState, useEffect, useCallback, useMemo } from "react";
import SampleDatabase from "./SampleDatabase";

const API_URL = process.env.REACT_APP_API_URL;

const emptyCalendar = [
  [[], [], [], [], [], [], []],
  [[], [], [], [], [], [], []],
  [[], [], [], [], [], [], []],
  [[], [], [], [], [], [], []],
];

// Meal hook logic using sample data for testing
export const useSampleMeals = () => {
  const [recipes, setRecipes] = useState({});
  const [meals, setMeals] = useState(emptyCalendar);
  const [recipeTags, setRecipeTags] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const database = useMemo(() => new SampleDatabase(), []);

  // Function to fetch recipes
  const fetchRecipes = useCallback(async () => {
    return database.getRecipes();
  }, [database]);

  // Function to fetch meals in a given range
  const fetchMeals = useCallback(
    async (start) => {
      const end = new Date(start);
      end.setDate(end.getDate() + 6);
      return database.getMeals(start, end);
    },
    [database]
  );

  // Function to fetch recipe tags
  const fetchRecipeTags = useCallback(async () => {
    return database.getRecipeTags();
  }, [database]);

  // Function to fetch ingredients
  const fetchIngredients = useCallback(async () => {
    return database.getIngredients();
  }, [database]);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const startOfWeek = new Date();
        startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
        startOfWeek.getHours(0, 0, 0, 0);
        setRecipes(await fetchRecipes());
        setMeals(await fetchMeals(startOfWeek));
        setRecipeTags(await fetchRecipeTags());
        setIngredients(await fetchIngredients());
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [fetchRecipes, fetchMeals, fetchRecipeTags, fetchIngredients]);

  const getRecipeIngredients = async (recipeId) => {
    return database.getIngredients(recipeId);
  };

  const getRecipeInstructions = async (recipeId) => {
    return database.getInstructions(recipeId);
  };

  // Update meals to another week
  const getMeals = useCallback(
    async (start_date) => {
      setMeals(await fetchMeals(start_date));
    },
    [fetchMeals]
  );

  // Function to add a new recipe
  const addRecipe = async (name, tags, instructions, ingredients) => {
    setRecipes((prevRecipes) => [
      ...prevRecipes,
      database.addRecipe({ name, tags, instructions, ingredients }),
    ]);
  };

  // Function to add a new meal
  const addMeal = async (recipeId, date, mealType) => {
    // Add meal to database
    const newMeal = database.addMeal({ recipeId, date, mealType });

    // Update meal list for frontend
    setMeals((prevMeals) => {
      const updatedMeals = [...prevMeals];
      updatedMeals[mealType][date.getDay()].push(newMeal);
      return updatedMeals;
    });
  };

  // Function to delete a recipe
  const deleteRecipe = async (recipeId) => {
    database.deleteRecipe(recipeId);
    setRecipes((prevRecipes) =>
      prevRecipes.filter((recipe) => recipe.RecipeId !== recipeId)
    );
  };

  // Function to delete a meal
  const deleteMeal = async (meal) => {
    database.deleteMeal(meal.MealId);
    setMeals((prevMeals) => {
      const updatedMeals = [...prevMeals];
      const idx = updatedMeals[meal.MealType][meal.Date.getDay()].findIndex(
        (m) => m.MealId === meal.MealId
      );
      updatedMeals[meal.MealType][meal.Date.getDay()].splice(idx, 1);
      return updatedMeals;
    });
  };

  // Function to update a recipe
  const updateRecipe = async (
    recipeId,
    name,
    tags,
    instructions,
    ingredients
  ) => {
    database.updateRecipe({ recipeId, name, tags, instructions, ingredients });
    setRecipes((prevRecipes) => {
      const idx = prevRecipes.findIndex(
        (recipe) => recipe.RecipeId === recipeId
      );
      prevRecipes[idx] = {
        Name: name,
        ...prevRecipes[idx],
      };
    });
  };

  // Function to update a meal
  const updateMeal = async (meal, date, mealType) => {
    database.updateMeal({ mealId: meal.MealId, date, mealType });
    setMeals((prevMeals) => {
      const updatedMeals = [...prevMeals];
      const idx = prevMeals[meal.MealType][meal.Date.getDay()].findIndex(
        (m) => m.MealId === meal.MealId
      );

      // Remove old meal
      updatedMeals[meal.MealType][meal.Date.getDay()].splice(idx, 1);

      // Add new meal
      updatedMeals[mealType][date.getDay()].push({
        ...meal,
        Date: date,
        MealType: mealType,
      });

      return updatedMeals;
    });
  };

  return {
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
  };
};

const useMeals = () => {
  const [recipes, setRecipes] = useState([]);
  const [meals, setMeals] = useState(emptyCalendar);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to fetch recipes
  const fetchRecipes = async () => {
    const response = await fetch(`${API_URL}/recipes`);
    if (!response.ok) throw new Error("Failed to fetch recipes");
    return await response.json();
  };

  // Function to fetch meals
  // TODO: Update to accept a week to query
  const fetchMeals = async () => {
    const response = await fetch(`${API_URL}/meals`);
    if (!response.ok) throw new Error("Failed to fetch meals");
    return await response.json();
  };

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setRecipes(await fetchRecipes());
        setMeals(await fetchMeals());
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  // Function to add a new recipe
  const addRecipe = async () => {};

  // Function to add a new meal
  const addMeal = async () => {};

  // Function to delete a recipe
  const deleteRecipe = async () => {};

  // Function to delete a meal
  const deleteMeal = async () => {};

  // Function to update a recipe
  const updateRecipe = async () => {};

  // Function to update a meal
  const updateMeal = async () => {};

  return {
    recipes,
    meals,
    loading,
    error,
    addRecipe,
    addMeal,
    deleteRecipe,
    deleteMeal,
    updateRecipe,
    updateMeal,
  };
};

export default useMeals;
