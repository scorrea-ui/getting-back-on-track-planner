import { Label, TextInput, Button } from "flowbite-react";
import { Form, useActionData, Link } from "@remix-run/react";
import { action } from "~/actions/login.server";

export { action };

export default function Login(): JSX.Element {
  const actionData = useActionData<{ error?: string }>();

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <div
        className="hidden md:block md:w-1/2 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://tpkovjgiyfcsrekkckcg.supabase.co/storage/v1/object/public/public_images/login-bg.png?t=2024-09-02T18%3A39%3A45.864Z')",
        }}
      ></div>
      <div className="flex items-center justify-center w-full md:w-1/2 p-8 bg-gray-100">
        <div className="w-full max-w-md p-8 space-y-6 bg-white rounded shadow-md">
          <h2 className="text-2xl font-bold text-center text-gray-900">
            Login
          </h2>
          <Form method="post" className="space-y-6">
            {actionData != null && actionData?.error !== "" && (
              <div
                className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg"
                role="alert"
              >
                {actionData.error}
              </div>
            )}
            <div>
              <Label
                htmlFor="email"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                Your email
              </Label>
              <TextInput
                type="email"
                id="email"
                name="email"
                placeholder="name@flowbite.com"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded"
              />
            </div>
            <div>
              <Label
                htmlFor="password"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                Your password
              </Label>
              <TextInput
                type="password"
                id="password"
                name="password"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded"
              />
            </div>
            <Button
              type="submit"
              className="w-full py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
            >
              Submit
            </Button>
            <div className="text-center">
              <Link
                to="/signup"
                className="text-sm text-blue-600 hover:underline"
              >
                Don't have an account? Sign up
              </Link>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}
