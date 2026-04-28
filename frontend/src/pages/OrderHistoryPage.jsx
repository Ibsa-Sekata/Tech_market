import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api/client";

export default function OrderHistoryPage() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    async function loadOrders() {
      const response = await api.get("/orders");
      setOrders(response.data.data);
    }

    loadOrders();
  }, []);

  return (
    <section>
      <h1>Order History</h1>
      <div className="stack gap">
        {orders.map((order) => (
          <article className="card" key={order._id}>
            <p>Order: {order._id}</p>
            <p>Status: {order.status}</p>
            <p>Total: ${order.totalPrice.toFixed(2)}</p>
            <Link to={`/orders/${order._id}`}>View Order</Link>
          </article>
        ))}
      </div>
    </section>
  );
}
