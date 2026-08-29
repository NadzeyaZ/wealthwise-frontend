import { Route, Routes } from "react-router";
import Layout from "./layout/Layout";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import AdvisorDashboard from "./components/advisor/AdvisorDashboard";
import ClientDashboard from "./components/client/ClientDashboard";
import { ClientProvider } from "./context/ClientsContext";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Login />} />
        <Route path="/clients" element={<AdvisorDashboard />} />
        <Route
          path="/clients/:clientId/investments"
          element={
            <ClientProvider>
              <ClientDashboard />
            </ClientProvider>
          }
        />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
      </Route>
    </Routes>
  );
}
