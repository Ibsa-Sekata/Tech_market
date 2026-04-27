import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

export default function Navbar() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <Link className="brand" to="/">
          TechMarket
        </Link>
        <nav className="nav-links">
          <NavLink to="/shop">Shop</NavLink>
          <NavLink to="/cart">Cart ({cart.itemCount})</NavLink>
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
    </header>
  );
}
