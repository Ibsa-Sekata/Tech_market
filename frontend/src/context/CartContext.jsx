import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { api } from "../api/client";
import { useAuth } from "./AuthContext";

const CartContext = createContext(null);
const GUEST_KEY = "techmarket_guest_cart";

export function CartProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const [cart, setCart] = useState({ items: [], totalPrice: 0, itemCount: 0 });

  useEffect(() => {
    if (isAuthenticated) {
      syncServerCart();
      return;
    }

    const raw = localStorage.getItem(GUEST_KEY);
    if (raw) {
      const guestItems = JSON.parse(raw);
      setCart(buildGuestSummary(guestItems));
    }
  }, [isAuthenticated]);

  function buildGuestSummary(items) {
    const normalized = items || [];
    const totalPrice = normalized.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
    const itemCount = normalized.reduce((sum, item) => sum + item.quantity, 0);
    return { items: normalized, totalPrice, itemCount };
  }

  async function syncServerCart() {
    const raw = localStorage.getItem(GUEST_KEY);
    if (raw) {
      const guestItems = JSON.parse(raw).map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
      }));
      if (guestItems.length > 0) {
        await api.post("/cart/merge", { items: guestItems });
      }
      localStorage.removeItem(GUEST_KEY);
    }

    const response = await api.get("/cart");
    setCart(response.data.data);
  }

  async function addToCart(product, quantity = 1) {
    if (isAuthenticated) {
      const response = await api.post("/cart", {
        productId: product._id,
        quantity,
      });
      setCart(response.data.data);
      return;
    }

    const raw = localStorage.getItem(GUEST_KEY);
    const guestItems = raw ? JSON.parse(raw) : [];

    const existing = guestItems.find((item) => item.productId === product._id);
    if (existing) {
      existing.quantity += quantity;
    } else {
      guestItems.push({
        productId: product._id,
        quantity,
        name: product.name,
        imageUrl: product.imageUrl,
        price: product.price,
        stock: product.stock,
        subtotal: product.price * quantity,
      });
    }

    localStorage.setItem(GUEST_KEY, JSON.stringify(guestItems));
    setCart(buildGuestSummary(guestItems));
  }

  async function updateItem(productId, quantity) {
    if (isAuthenticated) {
      const response = await api.put(`/cart/${productId}`, { quantity });
      setCart(response.data.data);
      return;
    }

    const raw = localStorage.getItem(GUEST_KEY);
    const guestItems = raw ? JSON.parse(raw) : [];
    const item = guestItems.find((entry) => entry.productId === productId);
    if (!item) return;

    item.quantity = quantity;
    item.subtotal = item.price * quantity;

    localStorage.setItem(GUEST_KEY, JSON.stringify(guestItems));
    setCart(buildGuestSummary(guestItems));
  }

  async function removeItem(productId) {
    if (isAuthenticated) {
      const response = await api.delete(`/cart/${productId}`);
      setCart(response.data.data);
      return;
    }

    const raw = localStorage.getItem(GUEST_KEY);
    const guestItems = raw ? JSON.parse(raw) : [];
    const next = guestItems.filter((item) => item.productId !== productId);
    localStorage.setItem(GUEST_KEY, JSON.stringify(next));
    setCart(buildGuestSummary(next));
  }

  async function clearCart() {
    if (isAuthenticated) {
      const response = await api.delete("/cart");
      setCart(response.data.data);
      return;
    }

    localStorage.removeItem(GUEST_KEY);
    setCart({ items: [], totalPrice: 0, itemCount: 0 });
  }

  const value = useMemo(
    () => ({
      cart,
      addToCart,
      updateItem,
      removeItem,
      clearCart,
      refreshCart: syncServerCart,
    }),
    [cart, isAuthenticated],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
}
