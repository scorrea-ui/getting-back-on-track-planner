import { type ActionFunction, json, redirect } from "@remix-run/node";
import supabase from "~/supabase/client";

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (email === "" || password === "") {
    return json({ error: "Email and password are required" }, { status: 400 });
  }

  try {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error != null) {
      return json({ error: error.message }, { status: 401 });
    }

    return redirect("/");
  } catch (error: unknown) {
    return json({ error: (error as Error).message }, { status: 500 });
  }
};
