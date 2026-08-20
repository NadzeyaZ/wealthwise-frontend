import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";

import { useAuth } from "../../context/AuthContext";
import FormInput from "../FormInput";

/** A form that allows users to log into an existing account. */
export default function Login() {
  const { login, user } = useAuth();
  const navigate = useNavigate();

  const [error, setError] = useState(null);

  useEffect(() => {
    if (user?.role === "advisor") {
      navigate(`/clients`);
    } else if (user) {
      navigate(`/clients/${user.id}/investments`);
    }
  }, [user, navigate]);

  const onLogin = async (formData) => {
    const email = formData.get("email");
    const password = formData.get("password");
    try {
      await login({ email, password });
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold mb-4">Log in to your account</h1>
      <form action={onLogin} className="flex flex-col gap-2">
        <FormInput label="Email" name="email" type="email" required />
        <FormInput label="Password" name="password" type="password" required />
        <button className="bg-blue-400 text-white p-2 rounded">Login</button>
        {error && <output className="text-red-500">{error}</output>}
      </form>
      <Link to="/register" className="text-sm">
        Need an account?
        <p className="text-blue-500 underline">Register here</p>
      </Link>
    </div>
  );
}
