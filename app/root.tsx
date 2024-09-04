import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useRouteError,
} from "@remix-run/react";
import { ThemeModeScript } from "flowbite-react";
import { SpeedInsights } from "@vercel/speed-insights/remix";
import type { LinksFunction, MetaFunction } from "@remix-run/node";
import stylesheet from "~/tailwind.css?url";
import { loader } from "~/loaders/auth.server";
import AppDrawer from "./components/AppDrawer";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesheet },
];

export const meta: MetaFunction = () => {
  return [
    { title: "The Planner" },
    {
      property: "og:title",
      content: "The Planner",
    },
    {
      name: "description",
      content: "A budget, task, meal, shopping list, and recipe planner.",
    },
  ];
};

export { loader };

export default function App(): JSX.Element {
  const { user } = useLoaderData<typeof loader>();

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
        <ThemeModeScript />
      </head>
      <body>
        <AppDrawer user={user} />
        <SpeedInsights />
        <Outlet />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export function ErrorBoundary(): JSX.Element {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return (
      <div>
        <h1>
          {error.status} {error.statusText}
        </h1>
        <p>{error.data}</p>
      </div>
    );
  } else if (error instanceof Error) {
    return (
      <div>
        <h1>Error</h1>
        <p>{error.message}</p>
        <p>The stack trace is:</p>
        <pre>{error.stack}</pre>
      </div>
    );
  } else {
    return <h1>Unknown Error</h1>;
  }
}
