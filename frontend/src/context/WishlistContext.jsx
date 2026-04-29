import React, { createContext, useContext, useEffect, useState } from "react";

const WishlistContext = createContext();

export function WishlistProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      const raw = localStorage.getItem("tm_wishlist");
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("tm_wishlist", JSON.stringify(items));
    } catch (e) {}
  }, [items]);

  function add(item) {
    setItems((prev) => {
      if (prev.find((p) => p._id === item._id)) return prev;
      return [item, ...prev];
    });
  }

  function remove(id) {
    setItems((prev) => prev.filter((p) => p._id !== id));
  }

  function toggle(item) {
    const exists = items.find((p) => p._id === item._id);
    if (exists) remove(item._id);
    else add(item);
  }

  return (
    <WishlistContext.Provider value={{ items, add, remove, toggle }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  return useContext(WishlistContext);
}
