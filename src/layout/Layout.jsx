import { Outlet } from "react-router";

import Navbar from "./Navbar";

export default function Layout() {
  return (
    <>
      <Navbar />
      <main className="flex flex-col items-center justify-center p-4">
        <Outlet />
      </main>
    </>
  );
}
