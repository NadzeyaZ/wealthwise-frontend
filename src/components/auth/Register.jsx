import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";

import { useAuth } from "../../context/AuthContext";
import FormInput from "../FormInput";

/** A form that allows users to register for a new account */
export default function Register() {
  const { register, user } = useAuth();
  const navigate = useNavigate();

  const [error, setError] = useState(null);

  useEffect(() => {
    if (user?.role === "advisor") {
      navigate(`/clients`);
    } else if (user) {
      navigate(`/clients/${user.id}/investments`);
    }
  }, [user, navigate]);

  const onRegister = async (formData) => {
    const firstName = formData.get("firstName");
    const lastName = formData.get("lastName");
    const email = formData.get("email");
    const password = formData.get("password");
    const role = formData.get("accountType");
    try {
      await register({ email, password, firstName, lastName, role });
      navigate("/");
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <div className="min-h-screen flex items-start justify-center bg-gray-50 px-4 py-4">
      <div className="w-full max-w-md bg-white rounded-xl border border-gray-200 shadow-sm p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Create account
          </h1>
          <p className="text-gray-600">
            Join WealthWise and start managing your wealth
          </p>
        </div>
        <form action={onRegister} className="space-y-4 mb-6">
          <FormInput label="First Name" name="firstName" required />
          <FormInput label="Last Name" name="lastName" required />
          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium text-gray-700">
              Account Type
            </span>
            <select
              name="accountType"
              required
              className="border border-gray-200 rounded-lg px-4 py-3 text-slate-900 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100 hover:border-gray-300 transition-colors"
            >
              <option value="">Select account type</option>
              <option value="client">Client</option>
              <option value="advisor">Advisor</option>
            </select>
          </label>
          <FormInput label="Email" name="email" type="email" required />
          <FormInput
            label="Password"
            name="password"
            type="password"
            required
          />
          <FormInput
            label="Repeat Password"
            name="repeatPassword"
            type="password"
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-950 text-white py-3 rounded-lg font-medium hover:bg-blue-900 transition-colors"
          >
            Create account
          </button>
          {error && (
            <output className="block text-red-600 bg-red-50 border border-red-200 rounded-lg p-3 text-sm">
              {error}
            </output>
          )}
        </form>
        <div className="border-t border-gray-200 pt-6">
          <p className="text-center text-gray-600 text-sm">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-blue-950 font-medium hover:underline"
            >
              Log in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
