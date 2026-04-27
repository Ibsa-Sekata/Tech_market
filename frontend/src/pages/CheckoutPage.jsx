import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/client";
import { useCart } from "../context/CartContext";

const defaultAddress = {
  street: "",
  city: "",
  postalCode: "",
  country: "",
};

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { cart, refreshCart } = useCart();
  const [shippingAddress, setShippingAddress] = useState(defaultAddress);
  const [paymentMethod, setPaymentMethod] = useState("Credit Card");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();

    if (cart.items.length === 0) {
      alert("Cart is empty");
      return;
    }

    setSubmitting(true);
    try {
      const response = await api.post("/orders", {
        shippingAddress,
        paymentMethod,
      });

      await refreshCart();
      navigate(`/orders/${response.data.data.order._id}`);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section>
      <h1>Checkout</h1>
      <form className="stack gap" onSubmit={handleSubmit}>
        <input
          onChange={(e) =>
            setShippingAddress((prev) => ({ ...prev, street: e.target.value }))
          }
          placeholder="Street"
          required
          value={shippingAddress.street}
        />
        <input
          onChange={(e) =>
            setShippingAddress((prev) => ({ ...prev, city: e.target.value }))
          }
          placeholder="City"
          required
          value={shippingAddress.city}
        />
        <input
          onChange={(e) =>
            setShippingAddress((prev) => ({
              ...prev,
              postalCode: e.target.value,
            }))
          }
          placeholder="Postal Code"
          required
          value={shippingAddress.postalCode}
        />
        <input
          onChange={(e) =>
            setShippingAddress((prev) => ({ ...prev, country: e.target.value }))
          }
          placeholder="Country"
          required
          value={shippingAddress.country}
        />

        <select
          onChange={(e) => setPaymentMethod(e.target.value)}
          value={paymentMethod}
        >
          <option value="Credit Card">Credit Card</option>
          <option value="PayPal">PayPal</option>
        </select>

        <button className="btn-primary" disabled={submitting} type="submit">
          {submitting ? "Processing..." : "Place Order"}
        </button>
      </form>
    </section>
  );
}
