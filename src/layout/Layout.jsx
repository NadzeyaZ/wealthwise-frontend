import { Outlet } from "react-router";

import Navbar from "./Navbar";

export default function Layout() {
  return (
    <>
      <Navbar />
      <main className="flex flex-col min-w-full p-4">
        <Outlet />
      </main>
    </>
  );
}
