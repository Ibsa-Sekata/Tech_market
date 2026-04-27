import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <section className="hero">
      <div>
        <h1>Shop modern tech with confidence.</h1>
        <p>
          Discover curated laptops, phones, accessories, and software with
          secure checkout.
        </p>
        <div className="row gap">
          <Link className="btn-primary" to="/shop">
            Start Shopping
          </Link>
          <Link className="btn-secondary" to="/register">
            Create Account
          </Link>
        </div>
      </div>
    </section>
  );
}
