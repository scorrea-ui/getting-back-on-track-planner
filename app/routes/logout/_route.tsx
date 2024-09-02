import { type ActionFunction } from "@remix-run/node";
import { action as logoutAction } from "~/actions/logout.server";

export const action: ActionFunction = logoutAction;
