import { useLoaderData } from "@remix-run/react";
import { FaClock, FaUtensils } from "react-icons/fa";
import { motion } from "framer-motion";
import parse from "html-react-parser";
import {
  singleRecipeLoader as loader,
  type Recipe,
} from "~/loaders/recipes.server";

export { loader };

export default function RecipePage(): JSX.Element {
  const { recipe } = useLoaderData<{ recipe: Recipe }>();

  // Define basic animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.section
      className="container mx-auto p-4 pt-8"
      initial="hidden"
      animate="visible"
      transition={{ staggerChildren: 0.2 }}
    >
      <div className="flex flex-col md:items-end md:justify-between md:flex-row mb-4">
        <motion.div
          className="md:w-1/2 md:pr-4 order-2 md:order-1"
          variants={fadeInUp}
          transition={{ duration: 0.5 }}
        >
          <motion.h1
            className="text-4xl font-bold mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            {recipe.title}
          </motion.h1>
          <div className="flex items-center space-x-4 mb-4">
            <motion.div
              className="flex items-center space-x-2"
              variants={fadeInUp}
            >
              <FaClock />
              <span>
                Prep time:{" "}
                {recipe.prep_hours > 0 &&
                  `${recipe.prep_hours} hr${recipe.prep_hours > 1 ? "s" : ""} `}
                {recipe.prep_minutes > 0 &&
                  `${recipe.prep_minutes} min${recipe.prep_minutes > 1 ? "s" : ""}`}
              </span>
            </motion.div>
            <motion.div
              className="flex items-center space-x-2"
              variants={fadeInUp}
            >
              <FaUtensils />
              <span>
                Cook time:{" "}
                {recipe.cook_hours > 0 &&
                  `${recipe.cook_hours} hr${recipe.cook_hours > 1 ? "s" : ""} `}
                {recipe.cook_minutes > 0 &&
                  `${recipe.cook_minutes} min${recipe.cook_minutes > 1 ? "s" : ""}`}
              </span>
            </motion.div>
          </div>
          <motion.div variants={fadeInUp} transition={{ duration: 0.7 }}>
            {parse(recipe.description)}
          </motion.div>
        </motion.div>
        <motion.div
          className="md:w-1/2 flex md:justify-end md:items-end order-1 md:order-2 mb-6 md:mb-0"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <div className="relative transform transition-transform duration-300 hover:scale-105">
            <img
              src={recipe.image_url}
              alt={recipe.title}
              className="w-full max-w-md mx-auto md:mx-0 h-auto rounded-lg object-cover"
            />
            <div className="w-full absolute bottom-0 left-0 bg-black bg-opacity-50 text-white text-center p-2 text-sm rounded-b-lg">
              Created by {recipe.user_name}
            </div>
          </div>
        </motion.div>
      </div>
      <motion.hr
        className="my-8 border-black"
        initial={{ width: 0 }}
        animate={{ width: "100%" }}
        transition={{ duration: 0.5 }}
      />
      <div className="flex flex-col mx-auto justify-between md:flex-row mb-4">
        <motion.div
          className="md:w-2/4 md:border-r border-b md:border-b-0 pt-6 md:pt-0 border-solid border-black"
          variants={fadeInUp}
        >
          <div className="max-w-lg">
            <h2 className="text-2xl font-bold mb-8">Ingredients</h2>
            <p className="mb-4">
              <span className="font-bold">Yields:</span> {recipe.yields}
            </p>
            <ul className="list-none mb-6 md:mb-0">
              {recipe.ingredient_sections.map((section, sectionIndex) => (
                <div
                  key={`section-${sectionIndex}-${section.title}`}
                  className="mb-6"
                >
                  <h3 className="text-lg font-semibold mb-2">
                    {section.title}
                  </h3>
                  <ul>
                    {section.ingredients.map((ingredient, ingredientIndex) => (
                      <li
                        key={`ingredient-${ingredientIndex}-${ingredient.name}`}
                        className="mb-2"
                      >
                        {ingredient.name}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </ul>
          </div>
        </motion.div>
        <motion.div
          className="md:w-2/4 md:pl-6 pt-8 md:pt-0"
          variants={fadeInUp}
        >
          <h2 className="text-2xl font-bold mb-8">Preparation</h2>
          {recipe.steps.map((step, index) => (
            <div key={index}>
              <p className="mb-4 font-bold">
                <span>Step {index + 1}</span>
              </p>
              <li key={index} className="mb-2 list-none">
                {step}
              </li>
            </div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
}
