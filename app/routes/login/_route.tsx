import { Label, TextInput, Button } from "flowbite-react";
import { Form, useActionData } from "@remix-run/react";
import { action } from "~/actions/login.server";

export { action };

export default function Login(): JSX.Element {
  const actionData = useActionData<{ error?: string }>();

  return (
    <Form method="post" className="max-w-sm mx-auto">
      {actionData != null && actionData?.error !== "" && (
        <div className="mb-5 text-red-500">{actionData.error}</div>
      )}
      <div className="mb-5">
        <Label
          htmlFor="email"
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >
          Your email
        </Label>
        <TextInput
          type="email"
          id="email"
          name="email"
          placeholder="name@flowbite.com"
          required
        />
      </div>
      <div className="mb-5">
        <Label
          htmlFor="password"
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >
          Your password
        </Label>
        <TextInput type="password" id="password" name="password" required />
      </div>
      <Button type="submit" className="w-full sm:w-auto">
        Submit
      </Button>
    </Form>
  );
}
