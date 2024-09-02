import {
  type ActionFunction,
  type AppLoadContext,
  redirect,
} from "@remix-run/node";
import { type Params } from "@remix-run/react";
import { loader } from "~/loaders/auth.server";
import { type IngredientSections, type Recipe } from "~/loaders/recipes.server";
import supabase from "~/supabase/client";

interface AuthResponse {
  user: {
    id: string;
    email: string;
  } | null;
}

async function checkAuthentication(
  request: Request,
  params: Params<string>,
  context: AppLoadContext,
): Promise<AuthResponse | null> {
  try {
    const authResponse = await loader({ request, params, context });
    const auth =
      authResponse != null ? await (authResponse as Response).json() : null;

    if (auth.user === null) {
      return null;
    }

    return auth;
  } catch (error) {
    console.error("Error during authentication:", error);
    return null;
  }
}

export interface RecipeFormData {
  title: string;
  shortDescription?: string;
  prepHours: number;
  prepMinutes: number;
  cookHours: number;
  cookMinutes: number;
  description?: string;
  ingredientSections: IngredientSections[];
  steps: string[];
  imageFile: File | null;
  author?: string;
  user_name?: string;
  isPublic?: string;
  category: string;
  yields: string;
}

async function extractFormData(request: Request): Promise<RecipeFormData> {
  try {
    const formData = await request.formData();
    const title = formData.get("title") as string;
    const shortDescription = formData.get("shortDescription") as string;
    const category = formData.get("category") as string;
    const prepHours = parseInt(formData.get("prepHours") as string, 10);
    const prepMinutes = parseInt(formData.get("prepMinutes") as string, 10);
    const cookHours = parseInt(formData.get("cookHours") as string, 10);
    const cookMinutes = parseInt(formData.get("cookMinutes") as string, 10);
    const description = formData.get("description") as string;
    const ingredientSections = JSON.parse(
      formData.get("ingredientSections") as string,
    );
    const steps = JSON.parse(formData.get("steps") as string);
    const yields = formData.get("yields") as string;
    const imageFile = formData.get("image") as File;
    const isPublic = formData.get("isPublic") as string;

    return {
      title,
      shortDescription,
      prepHours,
      prepMinutes,
      cookHours,
      cookMinutes,
      description,
      ingredientSections,
      steps,
      imageFile,
      category,
      yields,
      isPublic,
    };
  } catch (error) {
    console.error("Error extracting form data:", error);
    throw error;
  }
}

async function uploadImage(imageFile: File | null): Promise<string | null> {
  if (imageFile == null) return null;

  try {
    const imagePath = `${crypto.randomUUID()}-${imageFile.name.trim()}`;
    const { error: uploadError } = await supabase.storage
      .from("recipes-images")
      .upload(imagePath, imageFile);

    if (uploadError != null) {
      throw new Error(uploadError.message);
    }

    return imagePath;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
}

async function getSignedUrl(imagePath: string): Promise<string | null> {
  try {
    const { data, error } = await supabase.storage
      .from("recipes-images")
      .createSignedUrl(imagePath, 604800, {
        transform: {
          width: 800,
          height: 400,
        },
      }); // Maximum expiration time of 7 days

    if (error != null) {
      throw new Error(error.message);
    }

    return data.signedUrl;
  } catch (error) {
    console.error("Error creating signed URL:", error);
    throw error;
  }
}

async function handleImageUpload(
  imageFile: File | null,
): Promise<string | null> {
  const imagePath = await uploadImage(imageFile);
  if (imagePath != null) {
    return await getSignedUrl(imagePath);
  }

  return null;
}

async function insertRecipe(
  auth: AuthResponse,
  recipeData: RecipeFormData,
  imageUrl: string | null,
): Promise<void> {
  if (auth?.user == null) {
    throw new Error("User authentication is required.");
  }

  try {
    const { error: insertError } = await supabase.from("recipes").insert([
      {
        user_id: auth.user.id,
        user_name: auth.user.email,
        title: recipeData.title,
        short_description: recipeData.shortDescription,
        prep_hours: recipeData.prepHours,
        prep_minutes: recipeData.prepMinutes,
        cook_hours: recipeData.cookHours,
        cook_minutes: recipeData.cookMinutes,
        description: recipeData.description,
        ingredient_sections: recipeData.ingredientSections,
        steps: recipeData.steps,
        yields: recipeData.yields,
        image_url: imageUrl,
        is_public: recipeData.isPublic,
      },
    ]);

    if (insertError != null) {
      console.error(insertError);
      throw new Error(insertError.message);
    }
  } catch (error) {
    console.error("Error inserting recipe:", error);
    throw error;
  }
}

async function updateRecipe(
  auth: AuthResponse,
  recipeId: string,
  recipeData: RecipeFormData,
  imageUrl: string | null,
): Promise<void> {
  if (auth?.user == null) {
    throw new Error("User authentication is required.");
  }

  try {
    const updateData: Partial<Recipe> = {
      title: recipeData.title,
      short_description: recipeData.shortDescription ?? "",
      prep_hours: recipeData.prepHours,
      prep_minutes: recipeData.prepMinutes,
      cook_hours: recipeData.cookHours,
      cook_minutes: recipeData.cookMinutes,
      description: recipeData.description ?? "",
      ingredient_sections: recipeData.ingredientSections,
      steps: recipeData.steps,
      yields: recipeData.yields,
      is_public: recipeData.isPublic,
      updated_at: new Date().toISOString(),
    };

    if (imageUrl !== null && imageUrl !== "") {
      updateData.image_url = imageUrl;
    }

    const { error } = await supabase
      .from("recipes")
      .update(updateData)
      .eq("recipe_id", recipeId);

    if (error != null) {
      console.error("Update Error:", error);
      throw new Error(error.message);
    }
  } catch (error) {
    console.error("Error updating recipe:", error);
    throw error;
  }
}

export const action: ActionFunction = async ({ request, params, context }) => {
  try {
    const auth = await checkAuthentication(request, params, context);

    if (auth === null) {
      return redirect("/login");
    }

    const recipeData = await extractFormData(request);

    const imageUrl =
      recipeData.imageFile != null && recipeData.imageFile?.size !== 0
        ? await handleImageUpload(recipeData.imageFile)
        : "";

    const recipeId = params.recipeId;

    if (recipeId == null) {
      await insertRecipe(auth, recipeData, imageUrl);
      return redirect("/recipes");
    }

    await updateRecipe(auth, recipeId, recipeData, imageUrl);

    return redirect(`/recipes/${recipeId}`);
  } catch (error) {
    console.error("Error in action function:", error);
    throw error;
  }
};

export const deleteAction: ActionFunction = async ({ request, params }) => {
  const { recipeId } = params;
  if (recipeId == null) {
    throw new Error("Not Found");
  }

  try {
    const { error } = await supabase
      .from("recipes")
      .delete()
      .eq("recipe_id", recipeId);

    if (error != null) {
      throw new Error(error.message);
    }

    return redirect("/recipes");
  } catch (error) {
    console.error("Error deleting recipe:", error);
    throw new Error("Internal Server Error");
  }
};
