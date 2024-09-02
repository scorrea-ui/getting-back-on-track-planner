import { type ActionFunction, json, redirect } from "@remix-run/node";
import supabase from "~/supabase/client";

export const action: ActionFunction = async () => {
  try {
    const { error } = await supabase.auth.signOut();

    if (error != null) {
      return json({ error: error.message }, { status: 401 });
    }

    return redirect("/login");
  } catch (error: unknown) {
    return json({ error: (error as Error).message }, { status: 500 });
  }
};
