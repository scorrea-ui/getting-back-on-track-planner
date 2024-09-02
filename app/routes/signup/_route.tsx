import { Form, useActionData } from "@remix-run/react";
import { action } from "~/actions/signup.server";
import { Button, Label, TextInput } from "flowbite-react";

export { action };

export default function Signup(): JSX.Element {
  const actionData = useActionData<{ error?: string }>();

  return (
    <Form method="post" className="max-w-sm mx-auto">
      {actionData !== null && actionData?.error !== undefined && (
        <div className="mb-5 text-red-500">{actionData.error}</div>
      )}
      <div className="mb-5">
        <Label
          htmlFor="fullName"
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >
          Full Name
        </Label>
        <TextInput
          type="text"
          id="fullName"
          name="fullName"
          placeholder="John Doe"
          required
        />
      </div>
      <div className="mb-5">
        <Label
          htmlFor="fullName"
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >
          User Name
        </Label>
        <TextInput
          type="text"
          id="userName"
          name="userName"
          placeholder="spider-man/woman"
          required
        />
      </div>
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
      <Button type="submit" className="w-full">
        Sign Up
      </Button>
    </Form>
  );
}
