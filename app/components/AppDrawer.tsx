import { useState } from "react";
import { Drawer, Button } from "flowbite-react";
import { FaBars } from "react-icons/fa";
import { Link } from "@remix-run/react";
import AppLogoutButton from "./AppLogoutButton";
import { type User } from "@supabase/supabase-js";

const protectedRoutes = [
  { path: "/recipes", name: "Recipes" },
  { path: "/recipes/create", name: "Add a new recipe" },
];

const publicRoutes = [{ path: "/", name: "Home" }];

export default function AppDrawer({
  user,
}: {
  user: User | undefined;
}): JSX.Element {
  const [isOpen, setIsOpen] = useState(false);

  const handleClose = (): void => {
    setIsOpen(false);
  };

  const toggleDrawer = (): void => {
    setIsOpen(true);
  };

  return (
    <>
      <div>
        <Button
          color="dark"
          onClick={() => {
            setIsOpen(true);
          }}
          className="m-4"
        >
          <FaBars size={16} />
        </Button>
      </div>
      <Drawer open={isOpen} onClose={handleClose}>
        <Drawer.Header
          title="The Planner"
          titleIcon={() => <></>}
        ></Drawer.Header>
        {user !== undefined ? (
          <div className="p-4 flex flex-col justify-between">
            <ul>
              {protectedRoutes.map((route) => (
                <Drawer.Items key={route.path} className="space-y-2">
                  <Link
                    to={route.path}
                    className="text-lg"
                    onClick={toggleDrawer}
                  >
                    {route.name}
                  </Link>
                </Drawer.Items>
              ))}
            </ul>
            <Drawer.Items className="space-y-2 mt-8">
              <AppLogoutButton />
            </Drawer.Items>
          </div>
        ) : (
          publicRoutes.map((route) => (
            <Drawer.Items key={route.path} className="space-y-2">
              <Link to={route.path} className="text-lg" onClick={toggleDrawer}>
                {route.name}
              </Link>
            </Drawer.Items>
          ))
        )}
      </Drawer>
    </>
  );
}
