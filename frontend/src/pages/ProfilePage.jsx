import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function ProfilePage() {
  const { user, loadProfile, updateProfile } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  useEffect(() => {
    async function init() {
      const profile = await loadProfile();
      if (profile) {
        setForm({
          name: profile.name || "",
          email: profile.email || "",
          password: "",
        });
      }
    }

    init();
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    const payload = { name: form.name, email: form.email };
    if (form.password) payload.password = form.password;

    await updateProfile(payload);
    alert("Profile updated");
  }

  return (
    <section>
      <h1>Profile</h1>
      <p>Role: {user?.role}</p>
      <form className="stack gap" onSubmit={handleSubmit}>
        <input
          onChange={(e) =>
            setForm((prev) => ({ ...prev, name: e.target.value }))
          }
          required
          value={form.name}
        />
        <input
          onChange={(e) =>
            setForm((prev) => ({ ...prev, email: e.target.value }))
          }
          required
          type="email"
          value={form.email}
        />
        <input
          minLength={6}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, password: e.target.value }))
          }
          placeholder="New password (optional)"
          type="password"
          value={form.password}
        />
        <button className="btn-primary" type="submit">
          Save Changes
        </button>
      </form>
    </section>
  );
}
