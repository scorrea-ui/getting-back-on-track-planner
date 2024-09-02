import { type LoaderFunction, json } from "@remix-run/node";
import supabase from "~/supabase/client";
import { loader as authLoader } from "~/loaders/auth.server";

export interface Ingredient {
  name: string;
}

export interface IngredientSections {
  title?: string;
  ingredients: Ingredient[];
}

export interface Recipe {
  id: number;
  created_at: string;
  updated_at: string;
  user_id: string;
  recipe_id: string;
  user_name: string;
  title: string;
  short_description: string;
  prep_hours: number;
  prep_minutes: number;
  cook_hours: number;
  cook_minutes: number;
  description: string;
  ingredient_sections: IngredientSections[] | [];
  steps: string[];
  image_url?: string;
  is_public: string;
  author: string;
  category: string;
  yields: string;
}

export const loader: LoaderFunction = async ({ request, params, context }) => {
  try {
    const authResponse = await authLoader({
      request,
      params,
      context,
    });

    const auth =
      authResponse != null ? await (authResponse as Response).json() : null;
    const userId = auth.user?.id;

    const { data: recipes, error } = await supabase
      .from("recipes")
      .select("*")
      .or(`user_id.eq.${userId}, is_public.eq.true`);

    if (error != null) {
      throw new Error(error.message);
    }

    return json({ recipes, auth });
  } catch (error: unknown) {
    return json({ error: (error as Error).message }, { status: 500 });
  }
};

export const singleRecipeLoader: LoaderFunction = async ({ params }) => {
  const { recipeId } = params;
  if (recipeId == null) {
    throw new Error("Not Found");
  }

  try {
    const { data: recipe, error } = await supabase
      .from("recipes")
      .select("*")
      .eq("recipe_id", recipeId)
      .single();

    if (error != null || recipe === null) {
      throw new Error("Not Found");
    }

    return json({ recipe });
  } catch (error) {
    console.error("Error fetching recipe:", error);
    throw new Error("Internal Server Error");
  }
};
