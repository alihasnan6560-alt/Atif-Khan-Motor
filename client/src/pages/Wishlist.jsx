// client/src/pages/Wishlist.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../styles/Wishlist.css";

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("wishlist")) || [];
    setWishlist(stored);
  }, []);

  const removeItem = (id) => {
    const updated = wishlist.filter((item) => item.id !== id);
    setWishlist(updated);
    localStorage.setItem("wishlist", JSON.stringify(updated));
  };

  if (wishlist.length === 0)
    return <p className="wishlist-empty">Your wishlist is empty.</p>;

  return (
    <div className="wishlist-container">
      <h2>Your Wishlist</h2>
      <div className="wishlist-grid">
        {wishlist.map((item) => (
          <div key={item.id} className="wishlist-item">
            <Link to={`/car/${item.id}`}>{item.name}</Link>
            <button onClick={() => removeItem(item.id)} className="remove-btn">&times;</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Wishlist;
