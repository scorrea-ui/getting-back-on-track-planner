import { type ActionFunction } from "@remix-run/node";
import { deleteAction } from "~/actions/recipe.server";

export const action: ActionFunction = deleteAction;
