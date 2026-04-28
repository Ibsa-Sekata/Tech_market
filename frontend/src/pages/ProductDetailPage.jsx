import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../api/client";
import { useCart } from "../context/CartContext";

export default function ProductDetailPage() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    async function loadData() {
      const [productResponse, reviewResponse] = await Promise.all([
        api.get(`/products/${id}`),
        api.get(`/reviews/${id}`),
      ]);

      setProduct(productResponse.data.data);
      setReviews(reviewResponse.data.data);
    }

    loadData();
  }, [id]);

  if (!product) return <p>Loading product...</p>;

  return (
    <section className="product-detail">
      <img alt={product.name} src={product.imageUrl} />
      <div>
        <h1>{product.name}</h1>
        <p>{product.description}</p>
        <p>${product.price.toFixed(2)}</p>
        <p>
          Rating: {product.ratings.toFixed(1)} ({product.numReviews} reviews)
        </p>
        <button
          className="btn-primary"
          onClick={() => addToCart(product, 1)}
          type="button"
        >
          Add to Cart
        </button>
      </div>

      <div className="reviews">
        <h2>Reviews</h2>
        {reviews.length === 0 && <p>No reviews yet.</p>}
        {reviews.map((review) => (
          <article className="card" key={review._id}>
            <strong>{review.userId?.name || "User"}</strong>
            <p>{review.rating}/5</p>
            <p>{review.comment}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
