import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";

export default function WishlistPage() {
  const { items, remove } = useWishlist();
  const { addToCart } = useCart();

  return (
    <section className="stack gap">
      <div className="row" style={{ justifyContent: "space-between" }}>
        <div>
          <h1 style={{ marginBottom: 6 }}>Wishlist</h1>
          <p className="muted" style={{ marginTop: 0 }}>
            Save products for later and move them to cart.
          </p>
        </div>
        <Link className="btn-secondary" to="/shop">
          Continue shopping
        </Link>
      </div>

      {items.length === 0 ? (
        <div className="card">
          <p style={{ marginTop: 0 }}>Your wishlist is empty.</p>
          <Link className="btn-primary" to="/shop">
            Browse products
          </Link>
        </div>
      ) : (
        <div className="grid">
          {items.map((product) => (
            <article className="card product-card" key={product._id}>
              <img
                alt={product.name}
                className="product-image"
                src={product.imageUrl}
              />
              <h3 style={{ margin: 0 }}>{product.name}</h3>
              <p className="muted" style={{ margin: 0 }}>
                {product.category}
              </p>
              <div className="card-footer">
                <div className="price-tag">${product.price.toFixed(2)}</div>
                <div className="row gap">
                  <Link className="btn-secondary" to={`/products/${product._id}`}>
                    View
                  </Link>
                  <button
                    className="btn-primary"
                    onClick={() => addToCart(product, 1)}
                    type="button"
                  >
                    Add to cart
                  </button>
                  <button
                    className="icon-btn"
                    onClick={() => remove(product._id)}
                    type="button"
                    aria-label="Remove from wishlist"
                    title="Remove"
                  >
                    ✕
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
