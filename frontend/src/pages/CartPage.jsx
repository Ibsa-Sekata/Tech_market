import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

export default function CartPage() {
  const { cart, updateItem, removeItem, clearCart } = useCart();
  const { isAuthenticated } = useAuth();

  return (
    <section>
      <h1>Your Cart</h1>
      {cart.items.length === 0 ? (
        <p>Cart is empty.</p>
      ) : (
        <>
          <div className="stack gap">
            {cart.items.map((item) => (
              <article className="card cart-item" key={item.productId}>
                <img alt={item.name} src={item.imageUrl} />
                <div>
                  <h3>{item.name}</h3>
                  <p>${item.price.toFixed(2)}</p>
                  <div className="row gap">
                    <input
                      min="1"
                      onChange={(e) =>
                        updateItem(item.productId, Number(e.target.value))
                      }
                      type="number"
                      value={item.quantity}
                    />
                    <button
                      onClick={() => removeItem(item.productId)}
                      type="button"
                    >
                      Remove
                    </button>
                  </div>
                </div>
                <strong>${item.subtotal.toFixed(2)}</strong>
              </article>
            ))}
          </div>
          <div className="summary card">
            <p>Items: {cart.itemCount}</p>
            <p>Total: ${cart.totalPrice.toFixed(2)}</p>
            <button className="btn-secondary" onClick={clearCart} type="button">
              Clear Cart
            </button>
            {isAuthenticated ? (
              <Link className="btn-primary" to="/checkout">
                Proceed to Checkout
              </Link>
            ) : (
              <Link className="btn-primary" to="/login">
                Login to Checkout
              </Link>
            )}
          </div>
        </>
      )}
    </section>
  );
}
