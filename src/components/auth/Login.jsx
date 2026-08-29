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
    <div className="min-h-screen flex items-start justify-center bg-gray-50 px-4 py-4">
      <div className="w-full max-w-md bg-white rounded-xl border border-gray-200 shadow-sm p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back
          </h1>
          <p className="text-gray-600">Log in to your WealthWise account</p>
        </div>
        <form action={onLogin} className="space-y-4 mb-6">
          <FormInput label="Email" name="email" type="email" required />
          <FormInput
            label="Password"
            name="password"
            type="password"
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-950 text-white py-3 rounded-lg font-medium hover:bg-blue-900 transition-colors"
          >
            Log in
          </button>
          {error && (
            <output className="block text-red-600 bg-red-50 border border-red-200 rounded-lg p-3 text-sm">
              {error}
            </output>
          )}
        </form>
        <div className="border-t border-gray-200 pt-6">
          <p className="text-center text-gray-600 text-sm">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-blue-950 font-medium hover:underline"
            >
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
