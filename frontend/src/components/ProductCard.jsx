import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function ProductCard({ product }) {
  const { addToCart } = useCart();

  return (
    <article className="card product-card">
      <img
        alt={product.name}
        className="product-image"
        src={product.imageUrl}
      />
      <h3>{product.name}</h3>
      <p>{product.category}</p>
      <p>${product.price.toFixed(2)}</p>
      <p>{product.stock > 0 ? "In Stock" : "Out of Stock"}</p>
      <div className="row gap">
        <Link className="btn-secondary" to={`/products/${product._id}`}>
          View
        </Link>
        <button
          className="btn-primary"
          disabled={product.stock === 0}
          onClick={() => addToCart(product, 1)}
          type="button"
        >
          Add to Cart
        </button>
      </div>
    </article>
  );
}
