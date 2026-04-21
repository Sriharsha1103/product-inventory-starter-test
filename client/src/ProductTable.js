import React, { useEffect, useState } from "react";

function ProductTable() {
  const [products, setProducts] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAllProducts = () => {
    setLoading(true);
    setError(null);

    fetch("http://localhost:5000/api/products")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch products");
        }
        return res.json();
      })
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  };

  const handleSearch = () => {
    const trimmedQuery = query.trim();
    if (!trimmedQuery) {
      fetchAllProducts();
      return;
    }

    setLoading(true);
    setError(null);

    fetch(
      `http://localhost:5000/api/products/search?query=${encodeURIComponent(
        trimmedQuery
      )}`
    )
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Something went wrong");
        }
        return data;
      })
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setProducts([]);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchAllProducts();
  }, []);

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  const handleReset = () => {
    setQuery("");
    fetchAllProducts();
  };

  const hasProducts = products && products.length > 0;

  return (
    <>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search by product name"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button type="button" onClick={handleSearch}>
          Search
        </button>
        <button type="button" className="secondary-btn" onClick={handleReset}>
          Reset
        </button>
      </div>

      {loading && <div className="state">Loading products...</div>}

      {error && <div className="state error">{error}</div>}

      {!loading && !error && !hasProducts && (
        <div className="state">No products found.</div>
      )}

      {!loading && !error && hasProducts && (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Created At</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product._id}>
                <td>{product.name}</td>
                <td>{Number(product.price).toFixed(2)}</td>
                <td>{product.quantity}</td>
                <td>{new Date(product.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}

export default ProductTable;
