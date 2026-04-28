import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      await register({
        name: form.name,
        email: form.email,
        password: form.password,
      });
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  }

  return (
    <section className="auth-page">
      <h1>Create Account</h1>
      <form className="stack gap" onSubmit={handleSubmit}>
        <input
          minLength={2}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, name: e.target.value }))
          }
          placeholder="Name"
          required
          value={form.name}
        />
        <input
          onChange={(e) =>
            setForm((prev) => ({ ...prev, email: e.target.value }))
          }
          placeholder="Email"
          required
          type="email"
          value={form.email}
        />
        <input
          minLength={6}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, password: e.target.value }))
          }
          placeholder="Password"
          required
          type="password"
          value={form.password}
        />
        <input
          minLength={6}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, confirmPassword: e.target.value }))
          }
          placeholder="Confirm Password"
          required
          type="password"
          value={form.confirmPassword}
        />
        {error && <p className="error">{error}</p>}
        <button className="btn-primary" type="submit">
          Register
        </button>
      </form>
      <p>
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </section>
  );
}
