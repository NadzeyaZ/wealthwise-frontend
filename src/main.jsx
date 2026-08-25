import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { ClientProvider } from "./context/ClientsContext.jsx";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <ClientProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ClientProvider>
  </AuthProvider>,
);
