// Get all date values in the current week
function getDatesInCurrentWeek() {
  const today = new Date();

  // Calculate the first day of the current week (Sunday)
  const firstDay = new Date(today);
  firstDay.setDate(today.getDate() - today.getDay());
  firstDay.setHours(0, 0, 0, 0);

  // Array to hold all the dates of the week
  const week = [];

  // Loop through all 7 days
  for (let i = 0; i < 7; i++) {
    const currDay = new Date(firstDay);
    currDay.setDate(firstDay.getDate() + i);
    week.push(currDay);
  }

  return week;
}

const datesInCurrentWeek = getDatesInCurrentWeek();

// Initial data for testing database
const initialData = {
  meals: [
    {
      MealId: 1,
      RecipeId: 2,
      Date: datesInCurrentWeek[0],
      MealType: 1,
    },
    {
      MealId: 2,
      RecipeId: 3,
      Date: datesInCurrentWeek[1],
      MealType: 2,
    },
    {
      MealId: 3,
      RecipeId: 1,
      Date: datesInCurrentWeek[2],
      MealType: 0,
    },
    {
      MealId: 4,
      RecipeId: 3,
      Date: datesInCurrentWeek[2],
      MealType: 3,
    },
    {
      MealId: 5,
      RecipeId: 1,
      Date: datesInCurrentWeek[3],
      MealType: 0,
    },
    {
      MealId: 6,
      RecipeId: 1,
      Date: datesInCurrentWeek[3],
      MealType: 1,
    },
    {
      MealId: 7,
      RecipeId: 3,
      Date: datesInCurrentWeek[3],
      MealType: 2,
    },
    {
      MealId: 8,
      RecipeId: 3,
      Date: datesInCurrentWeek[4],
      MealType: 3,
    },
    {
      MealId: 9,
      RecipeId: 2,
      Date: datesInCurrentWeek[5],
      MealType: 1,
    },
    {
      MealId: 10,
      RecipeId: 1,
      Date: datesInCurrentWeek[6],
      MealType: 0,
    },
  ],
  recipes: [
    {
      RecipeId: 1,
      Name: "Chicken Alfredo",
    },
    {
      RecipeId: 2,
      Name: "Greek Salad",
    },
    {
      RecipeId: 3,
      Name: "Butter Chicken",
    },
  ],
  recipeTags: [
    {
      RecipeTagId: 1,
      Name: "Vegetarian",
    },
    {
      RecipeTagId: 2,
      Name: "Quick",
    },
    {
      RecipeTagId: 3,
      Name: "Pasta",
    },
  ],
  recipeTagUses: [
    {
      RecipeTagUseId: 1,
      RecipeId: 1,
      RecipeTagId: 3,
    },
    {
      RecipeTagUseId: 2,
      RecipeId: 2,
      RecipeTagId: 1,
    },
    {
      RecipeTagUseId: 3,
      RecipeId: 2,
      RecipeTagId: 2,
    },
  ],
  instructions: [
    {
      InstructionId: 1,
      RecipeId: 1,
      Step: 1,
      Text: "Cook fettuccine",
    },
    {
      InstructionId: 2,
      RecipeId: 1,
      Step: 2,
      Text: "Cook chicken",
    },
    {
      InstructionId: 3,
      RecipeId: 1,
      Step: 3,
      Text: "Heat butter and garlic, add cream, then stir in parmesan",
    },
    {
      InstructionId: 4,
      RecipeId: 1,
      Step: 4,
      Text: "Toss with pasta and serve",
    },
    {
      InstructionId: 5,
      RecipeId: 2,
      Step: 1,
      Text: "Chop vegetables and mix with olives",
    },
    {
      InstructionId: 6,
      RecipeId: 2,
      Step: 2,
      Text: "Drizzle with olive oil and sprinkle oregano",
    },
    {
      InstructionId: 7,
      RecipeId: 2,
      Step: 3,
      Text: "Top with crumbled feta",
    },
    {
      InstructionId: 8,
      RecipeId: 3,
      Step: 1,
      Text: "Marinate chicken with spices",
    },
    {
      InstructionId: 9,
      RecipeId: 3,
      Step: 2,
      Text: "Cook in butter, add tomato puree and cream",
    },
    {
      InstructionId: 10,
      RecipeId: 3,
      Step: 3,
      Text: "Simmer and serve with naan or rice",
    },
  ],
  ingredientUses: [
    {
      IngredientUseId: 1,
      RecipeId: 1,
      IngredientId: 1,
      Amount: "1 box",
    },
    {
      IngredientUseId: 2,
      RecipeId: 1,
      IngredientId: 2,
      Amount: "1 quart",
    },
    {
      IngredientUseId: 3,
      RecipeId: 1,
      IngredientId: 3,
      Amount: "1 tablespoon",
    },
    {
      IngredientUseId: 4,
      RecipeId: 1,
      IngredientId: 4,
      Amount: "2 cloves",
    },
    {
      IngredientUseId: 5,
      RecipeId: 1,
      IngredientId: 5,
      Amount: "1 pound",
    },
    {
      IngredientUseId: 6,
      RecipeId: 1,
      IngredientId: 6,
      Amount: "1 bag",
    },
    {
      IngredientUseId: 7,
      RecipeId: 2,
      IngredientId: 7,
      Amount: "1 bag",
    },
    {
      IngredientUseId: 8,
      RecipeId: 2,
      IngredientId: 8,
      Amount: "1",
    },
    {
      IngredientUseId: 9,
      RecipeId: 2,
      IngredientId: 9,
      Amount: "1",
    },
    {
      IngredientUseId: 10,
      RecipeId: 2,
      IngredientId: 10,
      Amount: "1",
    },
    {
      IngredientUseId: 11,
      RecipeId: 2,
      IngredientId: 11,
      Amount: "1 block",
    },
    {
      IngredientUseId: 12,
      RecipeId: 2,
      IngredientId: 12,
      Amount: "1 can",
    },
    {
      IngredientUseId: 13,
      RecipeId: 2,
      IngredientId: 13,
      Amount: "1 tablespoon",
    },
    {
      IngredientUseId: 14,
      RecipeId: 3,
      IngredientId: 5,
      Amount: "1 pound",
    },
    {
      IngredientUseId: 15,
      RecipeId: 3,
      IngredientId: 3,
      Amount: "1 tablespoon",
    },
    {
      IngredientUseId: 16,
      RecipeId: 3,
      IngredientId: 9,
      Amount: "2",
    },
    {
      IngredientUseId: 17,
      RecipeId: 3,
      IngredientId: 2,
      Amount: "1 quart",
    },
    {
      IngredientUseId: 18,
      RecipeId: 3,
      IngredientId: 4,
      Amount: "2 cloves",
    },
    {
      IngredientUseId: 19,
      RecipeId: 3,
      IngredientId: 14,
      Amount: "1",
    },
    {
      IngredientUseId: 20,
      RecipeId: 3,
      IngredientId: 15,
      Amount: "1 tablespoon",
    },
  ],
  ingredients: [
    {
      IngredientId: 1,
      Name: "Fettuccine",
    },
    {
      IngredientId: 2,
      Name: "Heavy Cream",
    },
    {
      IngredientId: 3,
      Name: "Butter",
    },
    {
      IngredientId: 4,
      Name: "Garlic",
    },
    {
      IngredientId: 5,
      Name: "Chicken",
    },
    {
      IngredientId: 6,
      Name: "Parmesan",
    },
    {
      IngredientId: 7,
      Name: "Romaine Lettuce",
    },
    {
      IngredientId: 8,
      Name: "Cucumbers",
    },
    {
      IngredientId: 9,
      Name: "Tomatoes",
    },
    {
      IngredientId: 10,
      Name: "Red Onion",
    },
    {
      IngredientId: 11,
      Name: "Feta",
    },
    {
      IngredientId: 12,
      Name: "Olives",
    },
    {
      IngredientId: 13,
      Name: "Olive Oil",
    },
    {
      IngredientId: 14,
      Name: "Ginger",
    },
    {
      IngredientId: 15,
      Name: "Garam Masala",
    },
  ],
};

export default class SampleDatabase {
  constructor() {
    this.data = { ...initialData };
  }

  getRecipes() {
    return this.data.recipes.reduce((acc, recipe) => {
      acc[recipe.RecipeId] = {
        ...recipe,
      };

      return acc;
    }, {});
  }

  getMeals(start, end) {
    return this.data.meals
      .filter((meal) => meal.Date >= start && meal.Date <= end)
      .reduce(
        (acc, meal) => {
          // Extract the day of the week
          const day = meal.Date.getDay();

          // Add the current meal to the corresponding meal type and day
          acc[meal.MealType][day].push(meal);
          return acc;
        },
        [
          [[], [], [], [], [], [], []],
          [[], [], [], [], [], [], []],
          [[], [], [], [], [], [], []],
          [[], [], [], [], [], [], []],
        ]
      );
  }

  getRecipeTags(recipeId) {
    if (recipeId) {
      // Get tags for a specific recipe
      const tagUses = this.data.recipeTagUses.filter(
        (tag) => tag.RecipeId === recipeId
      );

      return tagUses.map((tag) => tag.RecipeTagId);
    }

    // Get available tags
    return [...this.data.recipeTags];
  }

  getIngredients(recipeId) {
    if (recipeId) {
      // Get ingredients for a specific recipe
      const ingredientUses = this.data.ingredientUses.filter(
        (ingredient) => ingredient.RecipeId === recipeId
      );

      return ingredientUses.map((ingredient) => ({
        IngredientId: ingredient.IngredientId,
        Amount: ingredient.Amount,
      }));
    }

    // Get available ingredients
    return this.data.ingredients.reduce((acc, ingr) => {
      acc[ingr.IngredientId] = {
        ...ingr,
      };

      return acc;
    }, {});
  }

  getInstructions(recipeId) {
    const instructions = this.data.instructions.filter(
      (instruction) => instruction.RecipeId === recipeId
    );

    // Order by step
    instructions.sort((a, b) => a.Step - b.Step);

    return instructions.map((instruction) => instruction.Text);
  }

  addRecipe({ name, tags, instructions, ingredients }) {
    // Add the recipe entry to the database
    const newRecipe = {
      RecipeId: this.data.recipes[this.data.recipes.length - 1].RecipeId + 1,
      Name: name,
    };
    this.data.recipes.push(newRecipe);

    // Add tag mappings for the recipe
    tags.forEach((tag) => {
      this.data.recipeTagUses.push({
        RecipeTagUseId:
          this.data.recipeTagUses[this.data.recipeTagUses.length - 1]
            .RecipeTagUseId + 1,
        RecipeId: newRecipe.RecipeId,
        RecipeTagId: tag,
      });
    });

    // Add instruction mappings for the recipe
    instructions.forEach((instruction, idx) => {
      this.data.instructions.push({
        InstructionId:
          this.data.instructions[this.data.instructions.length - 1]
            .InstructionId + 1,
        RecipeId: newRecipe.RecipeId,
        Step: idx + 1,
        Text: instruction,
      });
    });

    // Add ingredient mappings for the recipe
    ingredients.forEach((ingredient) => {
      this.data.ingredientUses.push({
        IngredientUseId:
          this.data.ingredientUses[this.data.ingredientUses.length - 1]
            .IngredientUseId + 1,
        RecipeId: newRecipe.RecipeId,
        IngredientId: ingredient.IngredientId,
        Amount: ingredient.Amount,
      });
    });

    return newRecipe;
  }

  addMeal({ recipeId, date, mealType }) {
    // Add the meal to the database
    const newMeal = {
      MealId: this.data.meals[this.data.meals.length - 1].MealId + 1,
      RecipeId: recipeId,
      Date: date,
      MealType: mealType,
    };
    this.data.meals.push(newMeal);

    return newMeal;
  }

  deleteRecipe(recipeId) {
    // Remove meals for the recipe
    this.data.meals = this.data.meals.filter(
      (meal) => meal.RecipeId !== recipeId
    );

    // Remove recipe tag uses
    this.data.recipeTagUses = this.data.recipeTagUses.filter(
      (tag) => tag.RecipeId !== recipeId
    );

    // Remove instructions for the recipe
    this.data.instructions = this.data.instructions.filter(
      (instruction) => instruction.RecipeId !== recipeId
    );

    // Remove ingredients used by the recipe
    this.data.ingredientUses = this.data.ingredientUses.filter(
      (ingredient) => ingredient.RecipeId !== recipeId
    );

    // Delete the recipe with the ID
    this.data.recipes.splice(
      this.data.recipes.findIndex((recipe) => recipe.RecipeId === recipeId),
      1
    );
  }

  deleteMeal(mealId) {
    // Delete the meal with the ID
    this.data.meals.splice(
      this.data.meals.findIndex((meal) => meal.MealId === mealId),
      1
    );
  }

  updateRecipe({ recipeId, name, tags, ingredients, instructions }) {
    // Update the name of the recipe
    const idx = this.data.recipes.findIndex(
      (recipe) => recipe.RecipeId === recipeId
    );
    this.data.recipes[idx] = {
      ...this.data.recipes[idx],
      Name: name,
    };

    // Replace the tags
    this.data.recipeTagUses = this.data.recipeTagUses.filter(
      (tag) => tag.RecipeId !== recipeId
    );
    tags.forEach((tag) => {
      this.data.recipeTagUses.push({
        RecipeTagUseId:
          this.data.recipeTagUses[this.data.recipeTagUses.length - 1]
            .RecipeTagUseId + 1,
        RecipeId: recipeId,
        RecipeTagId: tag,
      });
    });

    // Replace the ingredients
    this.data.ingredientUses = this.data.ingredientUses.filter(
      (ingredient) => ingredient.RecipeId !== recipeId
    );
    ingredients.forEach((ingredient) => {
      this.data.ingredientUses.push({
        IngredientUseId:
          this.data.ingredientUses[this.data.ingredientUses.length - 1]
            .IngredientId + 1,
        RecipeId: recipeId,
        IngredientId: ingredient.IngredientId,
        Amount: ingredient.Amount,
      });
    });

    // Replace the instructions
    this.data.instructions = this.data.instructions.filter(
      (instruction) => instruction.RecipeId !== recipeId
    );
    instructions.forEach((instruction, idx) => {
      this.data.instructions.push({
        InstructionId:
          this.data.instructions[this.data.instructions.length - 1]
            .InstructionId + 1,
        RecipeId: recipeId,
        Step: idx + 1,
        Text: instruction,
      });
    });
  }

  updateMeal({ mealId, date, mealType }) {
    // Update the mael properties
    const idx = this.data.meals.findIndex((meal) => meal.MealId === mealId);
    this.data.meals[idx] = {
      ...this.data.meals[idx],
      Date: date,
      MealType: mealType,
    };
  }
}
