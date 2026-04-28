import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../api/client";

export default function OrderDetailPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    async function loadOrder() {
      const response = await api.get(`/orders/${id}`);
      setOrder(response.data.data);
    }

    loadOrder();
  }, [id]);

  if (!order) return <p>Loading order...</p>;

  return (
    <section>
      <h1>Order {order._id}</h1>
      <p>Status: {order.status}</p>
      <p>Total: ${order.totalPrice.toFixed(2)}</p>
      <h2>Items</h2>
      <div className="stack gap">
        {order.orderItems.map((item) => (
          <article className="card" key={item.productId}>
            <p>{item.name}</p>
            <p>Qty: {item.quantity}</p>
            <p>Price: ${item.price.toFixed(2)}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
