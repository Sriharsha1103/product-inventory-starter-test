import React, { useState } from "react";
import axios from "axios";

const ProductSearch = () => {
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    try {
      setError("");

      const res = await axios.get(
        `http://localhost:5000/api/products/search?query=${query}`
      );

      setProducts(res.data);
    } catch (err) {
      if (err.response?.status === 400) {
        setError(err.response.data.error);
      } else {
        setError("Something went wrong");
      }
      setProducts([]);
    }
  };
  useEffect(() => {
  const delay = setTimeout(() => {
    if (query) handleSearch();
  }, 500);

  return () => clearTimeout(delay);
}, [query]);

  return (
    <div>
      <h2>Search Products</h2>

      {/* Input */}
      <input
        type="text"
        placeholder="Search product..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      <button onClick={handleSearch}>Search</button>

      {/* Error */}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Table */}
      <table border="1">
        <thead>
          <tr>
            <th>Name</th>
            <th>Price</th>
            <th>Quantity</th>
          </tr>
        </thead>

        <tbody>
          {products.length === 0 ? (
            <tr>
              <td colSpan="3">No results</td>
            </tr>
          ) : (
            products.map((p) => (
              <tr key={p._id}>
                <td>{p.name}</td>
                <td>{p.price}</td>
                <td>{p.quantity}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ProductSearch;