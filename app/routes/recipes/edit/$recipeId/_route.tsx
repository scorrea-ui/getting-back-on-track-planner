import { useLoaderData } from "@remix-run/react";
import { singleRecipeLoader as loader } from "~/loaders/recipes.server";
import RecipeForm from "~/components/RecipeForm";
import { action } from "~/actions/recipe.server";

export { action, loader };

function EditRecipe(): JSX.Element {
  const { recipe } = useLoaderData<typeof loader>();

  return (
    <RecipeForm
      recipe={recipe}
      formAction={`/recipes/edit/${recipe.recipe_id}`}
      buttonText="Update"
    />
  );
}

export default EditRecipe;
