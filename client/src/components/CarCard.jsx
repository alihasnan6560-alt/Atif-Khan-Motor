import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaHeart,
  FaArrowRight,
  FaCalendarAlt,
  FaTachometerAlt,
  FaCogs,
  FaMapMarkerAlt,
} from "react-icons/fa";

import "../styles/CarCard.css";

const API_BASE =
  import.meta.env.VITE_API_BASE || "http://localhost:5000";

const CarCard = ({ car }) => {
  const [wish, setWish] = useState(false);

  useEffect(() => {
    try {
      const list = JSON.parse(localStorage.getItem("wishlist")) || [];
      setWish(list.some((item) => item.id === car._id));
    } catch (error) {
      console.error("Wishlist parse error:", error);
      setWish(false);
    }
  }, [car._id]);

  const toggleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      const list = JSON.parse(localStorage.getItem("wishlist")) || [];
      let updated;

      if (wish) {
        updated = list.filter((item) => item.id !== car._id);
      } else {
        updated = [
          ...list,
          {
            id: car._id,
            name: car.name,
            imageUrl: car.imageUrl,
            price: car.price,
          },
        ];
      }

      localStorage.setItem("wishlist", JSON.stringify(updated));

      window.dispatchEvent(new Event("wishlistUpdated"));

      setWish(!wish);
    } catch (error) {
      console.error("Wishlist update error:", error);
    }
  };

  const imagePath = car.imageUrl
    ? car.imageUrl.startsWith("http://") ||
      car.imageUrl.startsWith("https://")
      ? car.imageUrl
      : `${API_BASE}${
          car.imageUrl.startsWith("/")
            ? car.imageUrl
            : `/${car.imageUrl}`
        }`
    : "";

  const formatMileage = (mileage) => {
    if (mileage === null || mileage === undefined || mileage === "") {
      return null;
    }

    return `${Number(mileage).toLocaleString()} km`;
  };

  const condition = car.condition || "Premium";

  return (
    <article className="card">
      <Link to={`/car/${car._id}`} className="card-link">
        <div className="card-image-wrap">
          {imagePath ? (
            <img
              src={imagePath}
              alt={car.name || "Luxury vehicle"}
              className="card-image"
              loading="lazy"
            />
          ) : (
            <div className="card-image-placeholder">
              No Image Available
            </div>
          )}

          <div className="card-status">
            <span>{condition}</span>
          </div>

          <button
            type="button"
            className={`heart-btn ${wish ? "active" : ""}`}
            onClick={toggleWishlist}
            title={wish ? "Remove from wishlist" : "Add to wishlist"}
            aria-label={wish ? "Remove from wishlist" : "Add to wishlist"}
          >
            <FaHeart />
          </button>

          <div className="card-overlay">
            <span>View Vehicle</span>
            <FaArrowRight />
          </div>
        </div>

        <div className="card-body">
          <div className="card-heading">
            <span className="card-label">
              {car.make || "PREMIUM"}
            </span>

            {car.year && (
              <span className="card-year">
                {car.year}
              </span>
            )}
          </div>

          <h3 className="card-title">
            {car.name || "Luxury Vehicle"}
          </h3>

          <div className="card-specs">
            {car.year && (
              <span className="spec-item">
                <FaCalendarAlt />
                {car.year}
              </span>
            )}

            {formatMileage(car.mileage) && (
              <span className="spec-item">
                <FaTachometerAlt />
                {formatMileage(car.mileage)}
              </span>
            )}

            {car.transmission && (
              <span className="spec-item">
                <FaCogs />
                {car.transmission}
              </span>
            )}
          </div>

          {car.location && (
            <div className="card-location">
              <FaMapMarkerAlt />
              <span>{car.location}</span>
            </div>
          )}

          <div className="card-meta">
            <div className="price-block">
              <span className="price-label">PRICE</span>

              <span className="price">
                {car.price != null
                  ? `${Number(car.price).toLocaleString()} AED`
                  : "Price on request"}
              </span>
            </div>

            <span className="details-link">
              View Details
              <FaArrowRight />
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
};

export default CarCard;