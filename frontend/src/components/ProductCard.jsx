import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { items: wishlistItems, toggle } = useWishlist();
  const inWishlist = wishlistItems.some((p) => p._id === product._id);

  return (
    <article className="card product-card">
      <div style={{ position: "relative" }}>
        <img alt={product.name} className="product-image" src={product.imageUrl} />
        <button
          aria-label="Toggle wishlist"
          onClick={() => toggle(product)}
          className="icon-btn"
          style={{ position: "absolute", top: 10, right: 10 }}
          type="button"
        >
          {inWishlist ? "♥" : "♡"}
        </button>
      </div>

      <h3 style={{ margin: 0 }}>{product.name}</h3>
      <p className="muted" style={{ margin: 0 }}>{product.category}</p>
      <div className="card-footer">
        <div>
          <div className="price-tag">${product.price.toFixed(2)}</div>
          <div className="muted" style={{ fontSize: 12 }}>
            {product.stock > 0 ? "In Stock" : "Out of Stock"}
          </div>
        </div>

        <div style={{ display: "flex", gap: ".5rem" }}>
          <Link className="btn-secondary" to={`/products/${product._id}`}>
            View
          </Link>
          <button
            className="btn-primary"
            disabled={product.stock === 0}
            onClick={() => addToCart(product, 1)}
            type="button"
          >
            Add
          </button>
        </div>
      </div>
    </article>
  );
}
