import { useEffect, useState } from "react";
import { api } from "../api/client";
import ProductCard from "../components/ProductCard";

export default function ShopPage() {
  const [products, setProducts] = useState([]);
  const [query, setQuery] = useState({
    search: "",
    category: "",
    sort: "newest",
    page: 1,
  });
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });

  useEffect(() => {
    async function loadProducts() {
      const response = await api.get("/products", {
        params: { ...query, limit: 12 },
      });
      setProducts(response.data.data);
      setPagination({
        page: response.data.page,
        totalPages: response.data.totalPages,
      });
    }

    loadProducts();
  }, [query]);

  return (
    <section>
      <h1>Shop</h1>
      <div className="filters">
        <input
          onChange={(e) =>
            setQuery((prev) => ({ ...prev, page: 1, search: e.target.value }))
          }
          placeholder="Search products"
          value={query.search}
        />
        <select
          onChange={(e) =>
            setQuery((prev) => ({ ...prev, page: 1, category: e.target.value }))
          }
          value={query.category}
        >
          <option value="">All Categories</option>
          <option value="Laptops">Laptops</option>
          <option value="Phones">Phones</option>
          <option value="Accessories">Accessories</option>
          <option value="Software">Software</option>
        </select>
        <select
          onChange={(e) =>
            setQuery((prev) => ({ ...prev, page: 1, sort: e.target.value }))
          }
          value={query.sort}
        >
          <option value="newest">Newest</option>
          <option value="price_asc">Price Low-High</option>
          <option value="price_desc">Price High-Low</option>
          <option value="rating_desc">Highest Rated</option>
        </select>
      </div>

      <div className="grid">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>

      <div className="row gap pagination">
        <button
          disabled={pagination.page <= 1}
          onClick={() => setQuery((prev) => ({ ...prev, page: prev.page - 1 }))}
          type="button"
        >
          Previous
        </button>
        <span>
          Page {pagination.page} of {pagination.totalPages}
        </span>
        <button
          disabled={pagination.page >= pagination.totalPages}
          onClick={() => setQuery((prev) => ({ ...prev, page: prev.page + 1 }))}
          type="button"
        >
          Next
        </button>
      </div>
    </section>
  );
}
