import { json, type LoaderFunction, redirect } from "@remix-run/node";
import supabase from "~/supabase/client";

export const pathsToIgnore = ["/login", "/signup"];

export const loader: LoaderFunction = async ({ request }) => {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const url = new URL(request.url);

  if (session === null) {
    if (!pathsToIgnore.includes(url.pathname)) {
      return redirect("/login");
    }
  }

  if (session !== null && pathsToIgnore.includes(url.pathname)) {
    return redirect("/");
  }

  return json({ user: session?.user });
};
