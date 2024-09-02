import { loader, type Recipe } from "~/loaders/recipes.server";
import { deleteAction as action } from "~/actions/recipe.server";
import { useLoaderData, Form, Link } from "@remix-run/react";
import { Button, Modal } from "flowbite-react";
import { useState } from "react";
import { FaTrash, FaEdit } from "react-icons/fa";

export { loader, action };

function Recipes(): JSX.Element {
  const { recipes, auth } = useLoaderData<{ recipes: Recipe[]; auth: any }>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

  const openModal = (recipe: Recipe): void => {
    setSelectedRecipe(recipe);
    setIsModalOpen(true);
  };

  const closeModal = (): void => {
    setSelectedRecipe(null);
    setIsModalOpen(false);
  };

  return (
    <section className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">Recipes</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 justify-items-center">
        {recipes !== null
          ? recipes.map((recipe) => (
              <div
                key={recipe.id}
                className="relative group max-w-sm overflow-hidden rounded-lg shadow-lg"
              >
                {recipe.image_url != null && (
                  <img
                    src={recipe.image_url}
                    alt={recipe.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110 md:w-96 md:h-96"
                  />
                )}
                <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-center items-center text-white p-4">
                  <div className="flex items-center flex-wrap justify-center mt-4 absolute top-2 right-2">
                    {auth.user?.email === recipe.user_name ? (
                      <>
                        <Button
                          className="mr-2"
                          href={`/recipes/edit/${recipe.recipe_id}`}
                          color="purple"
                        >
                          <FaEdit />
                        </Button>
                        <Button
                          onClick={() => {
                            openModal(recipe);
                          }}
                          color="failure"
                        >
                          <FaTrash />
                        </Button>
                      </>
                    ) : null}
                  </div>
                  <Link
                    className="text-center"
                    to={`/recipes/${recipe.recipe_id}`}
                    key={recipe.id}
                  >
                    <span className="bg-black text-white text-xs font-semibold mr-2 px-2.5 py-0.5 rounded-full mb-2">
                      {recipe.category}
                    </span>
                    <h2 className="text-xl text-center underline underline-offset-1 font-semibold mb-2">
                      {recipe.title}
                    </h2>
                    <p className="text-sm text-center">
                      {recipe.short_description}
                    </p>
                  </Link>
                  <p className="absolute md:bottom-4 bottom-2 right-2 md:right-4 text-xs text-gray-300">
                    By {recipe.user_name}
                  </p>
                </div>
              </div>
            ))
          : undefined}
      </div>

      <Modal show={isModalOpen} onClose={closeModal}>
        <Modal.Header>Confirm Delete</Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to delete this recipe?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button color="gray" onClick={closeModal}>
            Cancel
          </Button>
          <Form
            method="post"
            action={`/recipes/delete/${selectedRecipe?.recipe_id}`}
            onSubmit={closeModal}
          >
            <Button color="red" type="submit">
              Delete
            </Button>
          </Form>
        </Modal.Footer>
      </Modal>
    </section>
  );
}

export default Recipes;
