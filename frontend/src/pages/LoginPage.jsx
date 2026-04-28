import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    try {
      await login(form);
      navigate(location.state?.from || "/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  }

  return (
    <section className="auth-page">
      <h1>Login</h1>
      <form className="stack gap" onSubmit={handleSubmit}>
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
        {error && <p className="error">{error}</p>}
        <button className="btn-primary" type="submit">
          Login
        </button>
      </form>
      <p>
        No account? <Link to="/register">Create one</Link>
      </p>
    </section>
  );
}
