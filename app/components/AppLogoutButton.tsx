import { useFetcher } from "@remix-run/react";
import { Button } from "flowbite-react";

export default function LogoutButton(): JSX.Element {
  const fetcher = useFetcher();
  return (
    <fetcher.Form method="post" action="/logout">
      <Button type="submit" color="red">
        Logout
      </Button>
    </fetcher.Form>
  );
}
