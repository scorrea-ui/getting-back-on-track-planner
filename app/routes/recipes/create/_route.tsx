import RecipeForm from "~/components/RecipeForm";
import { action } from "~/actions/recipe.server";

export { action };

function CreateRecipe(): JSX.Element {
  return <RecipeForm formAction="/recipes/create" buttonText="Create" />;
}

export default CreateRecipe;
