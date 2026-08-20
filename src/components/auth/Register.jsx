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
    <div className="space-y-4">
      <h1 className="text-2xl font-bold mb-4">Register for an account</h1>
      <form action={onRegister} className="flex flex-col gap-2">
        <FormInput label="First Name" name="firstName" required />
        <FormInput label="Last Name" name="lastName" required />
        <select
          name="accountType"
          required
          className="border border-gray-300 p-2 rounded"
        >
          <option value="">Select account type</option>
          <option value="client">Client</option>
          <option value="advisor">Advisor</option>
        </select>
        <FormInput label="Email" name="email" type="email" required />
        <FormInput label="Password" name="password" type="password" required />
        <FormInput
          label="Repeat Password"
          name="repeatPassword"
          type="password"
          required
        />

        <button className="bg-blue-400 text-white p-2 rounded">Register</button>
        {error && <output className="text-red-500">{error}</output>}
      </form>
      <Link to="/login" className="text-sm">
        Already have an account?{" "}
        <p className="text-blue-500 underline">Log in here</p>
      </Link>
    </div>
  );
}
