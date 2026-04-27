import { useEffect, useState } from "react";
import { api } from "../api/client";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    async function loadStats() {
      const response = await api.get("/admin/stats");
      setStats(response.data.data);
    }

    loadStats();
  }, []);

  if (!stats) return <p>Loading stats...</p>;

  return (
    <section>
      <h1>Admin Dashboard</h1>
      <div className="grid stats-grid">
        <article className="card">
          <h3>Total Users</h3>
          <p>{stats.totalUsers}</p>
        </article>
        <article className="card">
          <h3>Total Products</h3>
          <p>{stats.totalProducts}</p>
        </article>
        <article className="card">
          <h3>Total Orders</h3>
          <p>{stats.totalOrders}</p>
        </article>
        <article className="card">
          <h3>Total Revenue</h3>
          <p>${stats.totalRevenue.toFixed(2)}</p>
        </article>
      </div>
    </section>
  );
}
