import { Route, Routes } from "react-router";
import Layout from "./layout/Layout";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import AdvisorDashboard from "./components/advisor/AdvisorDashboard";
import ClientDashboard from "./components/client/ClientDashboard";
import { useAuth } from "./context/AuthContext";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<p>Home page</p>} />
        <Route path="/advisor/:id" element={<AdvisorDashboard />} />
        <Route path="/client/:id" element={<ClientDashboard />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
      </Route>
    </Routes>
  );
}
