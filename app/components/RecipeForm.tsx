import { useFetcher } from "@remix-run/react";
import { TextInput, Button, Checkbox, Label, FileInput } from "flowbite-react";
import { useState } from "react";
import { FaPlus, FaTrash } from "react-icons/fa";
import AppTextEditor from "~/components/AppTextEditor";
import { type IngredientSections, type Recipe } from "~/loaders/recipes.server";

interface RecipeFormProps {
  recipe?: Recipe;
  formAction: string;
  buttonText: string;
}

const RecipeForm: React.FC<RecipeFormProps> = ({
  recipe,
  formAction,
  buttonText,
}) => {
  const fetcher = useFetcher();
  const [description, setDescription] = useState(recipe?.description ?? "");
  const [ingredientSections, setIngredientSections] = useState<
    IngredientSections[]
  >(recipe?.ingredient_sections ?? []);
  const [fileError, setFileError] = useState("");
  const [steps, setSteps] = useState(recipe?.steps ?? []);

  const handleDescriptionChange = (value: string): void => {
    setDescription(value);
  };

  const handleIngredientChange = (
    sectionIndex: number,
    ingredientIndex: number,
    value: string,
  ): void => {
    const newSections = [...ingredientSections];
    newSections[sectionIndex].ingredients[ingredientIndex].name = value;
    setIngredientSections(newSections);
  };

  const handleStepChange = (index: number, value: string): void => {
    const newSteps = [...steps];
    newSteps[index] = value;
    setSteps(newSteps);
  };

  const addIngredient = (sectionIndex: number): void => {
    const newSections = [...ingredientSections];
    newSections[sectionIndex].ingredients.push({ name: "" });
    setIngredientSections(newSections);
  };

  const removeIngredient = (
    sectionIndex: number,
    ingredientIndex: number,
  ): void => {
    const newSections = [...ingredientSections];
    newSections[sectionIndex].ingredients = newSections[
      sectionIndex
    ].ingredients.filter((_, i) => i !== ingredientIndex);
    setIngredientSections(newSections);
  };

  const addIngredientSection = (): void => {
    setIngredientSections([
      ...ingredientSections,
      { title: "", ingredients: [{ name: "" }] },
    ]);
  };

  const removeIngredientSection = (sectionIndex: number): void => {
    setIngredientSections(
      ingredientSections.filter((_, i) => i !== sectionIndex),
    );
  };

  const handleSectionTitleChange = (
    sectionIndex: number,
    value: string,
  ): void => {
    const newSections = [...ingredientSections];
    newSections[sectionIndex].title = value;
    setIngredientSections(newSections);
  };

  const addStep = (): void => {
    setSteps([...steps, ""]);
  };

  const removeStep = (index: number): void => {
    const newSteps = steps.filter((_, i) => i !== index);
    setSteps(newSteps);
  };

  const handleFileChange: React.ChangeEventHandler<HTMLInputElement> = (
    event,
  ) => {
    const file = event.target.files?.[0];
    if (file != null && file.size > 1.4 * 1024 * 1024) {
      setFileError("File size exceeds 1.4MB");
    } else {
      setFileError("");
    }
  };

  return (
    <section className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{buttonText} Recipe</h1>
      <fetcher.Form
        method="post"
        action={formAction}
        encType="multipart/form-data"
      >
        <div className="mb-4">
          <Label className="block mb-2">Recipe Title</Label>
          <TextInput
            name="title"
            placeholder="Recipe Title"
            required
            className="w-full"
            defaultValue={recipe?.title}
            autoComplete=""
            autoSave=""
          />
        </div>
        <div className="mb-4">
          <Label className="block mb-2">Short Description</Label>
          <TextInput
            name="shortDescription"
            placeholder="Short Description (max 89 characters)"
            className="w-full"
            defaultValue={recipe?.short_description}
            autoComplete=""
            autoSave=""
            maxLength={89}
          />
        </div>
        <div className="mb-4">
          <Label className="block mb-2">Yields how much food</Label>
          <TextInput
            name="yields"
            placeholder="Yields how much food"
            type="text"
            required
            className="w-full"
            defaultValue={recipe?.yields}
            autoComplete=""
            autoSave=""
          />
        </div>
        <div className="mb-4">
          <Label className="block mb-2">Prep Time</Label>
          <div className="flex space-x-2">
            <TextInput
              type="number"
              name="prepHours"
              placeholder="Hours"
              min="0"
              required
              className="w-1/2"
              defaultValue={recipe?.prep_hours}
              autoComplete=""
              autoSave=""
            />
            <TextInput
              type="number"
              name="prepMinutes"
              placeholder="Minutes"
              min="0"
              max="59"
              required
              className="w-1/2"
              defaultValue={recipe?.prep_minutes}
              autoComplete=""
              autoSave=""
            />
          </div>
        </div>
        <div className="mb-4">
          <Label className="block mb-2">Cook Time</Label>
          <div className="flex space-x-2">
            <TextInput
              type="number"
              name="cookHours"
              placeholder="Hours"
              min="0"
              required
              className="w-1/2"
              defaultValue={recipe?.cook_hours}
              autoComplete=""
              autoSave=""
            />
            <TextInput
              type="number"
              name="cookMinutes"
              placeholder="Minutes"
              min="0"
              max="59"
              required
              className="w-1/2"
              defaultValue={recipe?.cook_minutes}
              autoComplete=""
              autoSave=""
            />
          </div>
        </div>
        <div className="mb-4">
          <TextInput
            type="hidden"
            name="ingredientSections"
            value={JSON.stringify(ingredientSections)}
          />
          <label className="block mb-2">Ingredients</label>
          {ingredientSections.map((section, sectionIndex) => (
            <div key={sectionIndex} className="mb-4">
              <div className="flex items-center mb-2">
                <TextInput
                  autoComplete=""
                  autoSave=""
                  type="text"
                  placeholder="Section Title"
                  value={section.title}
                  onChange={(e) => {
                    handleSectionTitleChange(sectionIndex, e.target.value);
                  }}
                  className="w-2/3"
                  required
                />
                <Button
                  type="button"
                  color="failure"
                  onClick={() => {
                    removeIngredientSection(sectionIndex);
                  }}
                  className="flex items-center justify-center ml-2"
                >
                  <FaTrash />
                </Button>
              </div>
              {section.ingredients.map((ingredient, ingredientIndex) => (
                <div
                  key={ingredientIndex}
                  className="flex space-x-2 mb-2 items-center"
                >
                  <TextInput
                    autoComplete=""
                    autoSave=""
                    type="text"
                    placeholder={`Ingredient ${ingredientIndex + 1}`}
                    value={ingredient.name}
                    onChange={(e) => {
                      handleIngredientChange(
                        sectionIndex,
                        ingredientIndex,
                        e.target.value,
                      );
                    }}
                    className="w-2/3"
                    required
                  />
                  <Button
                    type="button"
                    color="failure"
                    onClick={() => {
                      removeIngredient(sectionIndex, ingredientIndex);
                    }}
                    className="flex items-center justify-center"
                  >
                    <FaTrash />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                color="dark"
                onClick={() => {
                  addIngredient(sectionIndex);
                }}
                className="flex items-center"
              >
                <FaPlus className="mr-2" />
                <span>Add Ingredient</span>
              </Button>
            </div>
          ))}
          <Button
            type="button"
            color="dark"
            onClick={addIngredientSection}
            className="flex items-center"
          >
            <FaPlus className="mr-2" />
            <span>Add Ingredient Section</span>
          </Button>
        </div>
        <div className="mb-4">
          <Label className="block mb-2">Long Description</Label>
          <AppTextEditor
            value={description}
            handleValueChange={handleDescriptionChange}
            inputPlaceholder="Description"
            inputName="description"
          />
          <input type="hidden" name="description" value={description} />
        </div>
        <div className="mb-4">
          <TextInput type="hidden" name="steps" value={JSON.stringify(steps)} />
          <Label className="block mb-2">Steps</Label>
          {steps.map((step, index) => (
            <div key={index} className="flex space-x-2 mb-2 items-center">
              <TextInput
                placeholder={`Step ${index + 1}`}
                value={step}
                onChange={(e) => {
                  handleStepChange(index, e.target.value);
                }}
                className="w-full"
                required
              />
              <Button
                type="button"
                color="failure"
                onClick={() => {
                  removeStep(index);
                }}
                className="flex items-center justify-center"
              >
                <FaTrash />
              </Button>
            </div>
          ))}
          <Button
            type="button"
            color="dark"
            onClick={addStep}
            className="flex items-center"
          >
            <FaPlus className="mr-2" />
            <span>Add Step</span>
          </Button>
        </div>
        <div className="mb-4">
          <Label className="block mb-2">Upload Image</Label>
          <FileInput
            required={recipe === undefined}
            name="image"
            accept="image/png, image/jpg"
            className="w-full"
            helperText="SVG, PNG, JPG or GIF (MAX. 800x400px)."
            onChange={handleFileChange}
          />
        </div>
        <div className="mb-4 flex items-center">
          <Checkbox
            id="isPublic"
            defaultChecked={recipe?.is_public === "on"}
            name="isPublic"
          />
          <Label className="ml-2" htmlFor="isPublic">
            Make this recipe public
          </Label>
        </div>
        <Button
          disabled={Boolean(fileError)}
          type="submit"
          outline
          gradientDuoTone="greenToBlue"
        >
          {buttonText}
        </Button>
      </fetcher.Form>
    </section>
  );
};

export default RecipeForm;
