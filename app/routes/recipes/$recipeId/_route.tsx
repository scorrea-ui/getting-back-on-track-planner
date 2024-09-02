import { useLoaderData } from "@remix-run/react";
import { FaClock, FaUtensils } from "react-icons/fa";
import {
  singleRecipeLoader as loader,
  type Recipe,
} from "~/loaders/recipes.server";

export { loader };

export default function RecipePage(): JSX.Element {
  const { recipe } = useLoaderData<{ recipe: Recipe }>();

  return (
    <section className="container mx-auto p-4">
      <div className="flex flex-col md:items-end md:justify-between md:flex-row mb-4">
        <div className="md:w-1/2 md:pr-4 order-2 md:order-1">
          <h1 className="text-4xl font-bold mb-4">{recipe.title}</h1>
          <div className="flex items-center space-x-2 mb-4">
            <span>Created by {recipe.user_name}</span>
          </div>
          <div className="flex items-center space-x-4 mb-4">
            <div className="flex items-center space-x-2">
              <FaClock />
              <span>
                Prep time:{" "}
                {recipe.prep_hours > 0 &&
                  `${recipe.prep_hours} hr${recipe.prep_hours > 1 ? "s" : ""} `}
                {recipe.prep_minutes > 0 &&
                  `${recipe.prep_minutes} min${recipe.prep_minutes > 1 ? "s" : ""}`}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <FaUtensils />
              <span>
                Cook time:{" "}
                {recipe.cook_hours > 0 &&
                  `${recipe.cook_hours} hr${recipe.cook_hours > 1 ? "s" : ""} `}
                {recipe.cook_minutes > 0 &&
                  `${recipe.cook_minutes} min${recipe.cook_minutes > 1 ? "s" : ""}`}
              </span>
            </div>
          </div>
          <p dangerouslySetInnerHTML={{ __html: recipe.description }}></p>
        </div>
        <div className="md:w-1/2 flex md:justify-end md:items-end order-1 md:order-2 mb-6 md:mb-0">
          <img
            src={recipe.image_url}
            alt={recipe.title}
            className="w-full max-w-lg mx-auto md:mx-0 h-auto rounded-lg object-cover"
          />
        </div>
      </div>
      <hr className="my-8 border-black" />
      <div className="flex flex-col mx-auto justify-between md:flex-row mb-4">
        <div className="md:w-2/4 md:border-r border-b md:border-b-0 pt-6 md:pt-0 border-solid border-black">
          <div className="max-w-lg">
            <h2 className="text-2xl font-bold mb-8">Ingredients</h2>
            <p className="mb-4">
              <span className="font-bold">Yields:</span> {recipe.yields}
            </p>
            <ul className="list-none mb-6 md:mb-0">
              {recipe.ingredient_sections.map((section, sectionIndex) => (
                <div key={sectionIndex} className="mb-6">
                  <h3 className="text-lg font-semibold mb-2">
                    {section.title}
                  </h3>
                  <ul>
                    {section.ingredients.map((ingredient, ingredientIndex) => (
                      <li className="mb-2" key={ingredientIndex}>
                        {ingredient.name}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </ul>
          </div>
        </div>
        <div className="md:w-2/4 md:pl-6 pt-8 md:pt-0">
          <h2 className="text-2xl font-bold mb-8">Preparation</h2>
          {recipe.steps.map((step, index) => (
            <>
              <p className="mb-4 font-bold">
                <span>Step {index + 1}</span>
              </p>
              <li key={index} className="mb-2 list-none">
                {step}
              </li>
            </>
          ))}
        </div>
      </div>
    </section>
  );
}
