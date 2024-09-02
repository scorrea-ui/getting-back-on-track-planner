import { Button } from "flowbite-react";

/*
 * I want to create a new Remix app that will allow me to do the following
 * Budget planning
 * Task management
 * Meal planning
 * Shopping list management
 * Recipe management
 */

export default function Index(): JSX.Element {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center p-8 bg-white shadow-lg rounded-lg">
        <h1 className="text-4xl font-bold mb-4">Work in Progress</h1>
        <Button href="/recipes">Check out some recipes</Button>
      </div>
    </div>
  );
}
