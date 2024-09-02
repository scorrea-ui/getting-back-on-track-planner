import { json, type ActionFunction, redirect } from "@remix-run/node";
import supabase from "~/supabase/client";

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const fullName = formData.get("fullName") as string;
  const userName = formData.get("userName") as string;

  if (email === "" || password === "" || fullName === "" || userName === "") {
    return json({ error: "All fields are required" }, { status: 400 });
  }

  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error != null) {
      return json({ error: error.message }, { status: 401 });
    }

    if (user != null) {
      const { error: insertError } = await supabase
        .from("profiles")
        .insert([{ id: user.id, full_name: fullName, user_name: userName }]);

      if (insertError != null) {
        return json({ error: insertError.message }, { status: 500 });
      }
    }

    return redirect("/");
  } catch (error: unknown) {
    return json({ error: (error as Error).message }, { status: 500 });
  }
};
