import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useState } from "react";

export default function Navbar() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { cart } = useCart();
  const { items: wishlistItems } = useWishlist();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  function handleLogout() {
    logout();
    navigate("/");
  }

  function handleSearch(e) {
    e.preventDefault();
    if (!search) return navigate("/shop");
    navigate(`/shop?search=${encodeURIComponent(search)}`);
  }

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <Link className="brand" to="/">
          TechMarket
        </Link>
        <div style={{ display: "flex", alignItems: "center", gap: ".75rem" }}>
          <form onSubmit={handleSearch} className="navbar-search">
            <input
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </form>
          <nav className="nav-links">
            <NavLink to="/shop">Shop</NavLink>
            <NavLink to="/cart">Cart ({cart.itemCount})</NavLink>
            <NavLink className="wishlist-link" to="/wishlist">
              Wishlist
              {wishlistItems.length > 0 && (
                <span className="wishlist-badge">{wishlistItems.length}</span>
              )}
            </NavLink>
            {isAuthenticated ? (
              <>
                <NavLink to="/profile">{user?.name || "Profile"}</NavLink>
                <NavLink to="/orders">Orders</NavLink>
                {isAdmin && <NavLink to="/admin">Admin</NavLink>}
                <button
                  className="link-button"
                  onClick={handleLogout}
                  type="button"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <NavLink to="/login">Login</NavLink>
                <NavLink to="/register">Register</NavLink>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
