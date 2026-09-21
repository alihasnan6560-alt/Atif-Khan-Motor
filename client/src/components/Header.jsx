import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  FaHeart,
  FaUser,
  FaTimes,
  FaBars,
  FaWhatsapp,
} from "react-icons/fa";

import "../styles/Header.css";

const Header = () => {
  const navigate = useNavigate();

  const [wishlist, setWishlist] = useState([]);
  const [showWishlist, setShowWishlist] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);

  const wishlistRef = useRef(null);

  // WhatsApp
  const whatsappNumber = "923045462472";

  const whatsappMessage = encodeURIComponent(
    "Hello Hasnain Automotive, I would like to inquire about a vehicle."
  );

  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  // Load wishlist
  useEffect(() => {
    const loadWishlist = () => {
      try {
        const stored =
          JSON.parse(localStorage.getItem("wishlist")) || [];

        setWishlist(stored);
      } catch (error) {
        console.error("Wishlist error:", error);
        setWishlist([]);
      }
    };

    loadWishlist();

    window.addEventListener("wishlistUpdated", loadWishlist);
    window.addEventListener("storage", loadWishlist);

    return () => {
      window.removeEventListener(
        "wishlistUpdated",
        loadWishlist
      );

      window.removeEventListener(
        "storage",
        loadWishlist
      );
    };
  }, []);

  // Close wishlist when clicking outside
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        wishlistRef.current &&
        !wishlistRef.current.contains(event.target)
      ) {
        setShowWishlist(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleOutsideClick
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick
      );
    };
  }, []);

  const handleWishlistClick = () => {
    setShowWishlist((prev) => !prev);
  };

  const handleWishlistItemClick = (id) => {
    setShowWishlist(false);
    setMobileMenu(false);

    navigate(`/car/${id}`);
  };

  const closeMobileMenu = () => {
    setMobileMenu(false);
  };

  return (
    <header className="noon-header">

      {/* LOGO */}
      <div className="header-brand">
        <Link
          to="/"
          className="logo-text"
          onClick={closeMobileMenu}
        >
          <span className="logo-main">
            HASNAIN
          </span>

          <span className="logo-sub">
            AUTOMOTIVE
          </span>
        </Link>
      </div>

      {/* DESKTOP NAVIGATION */}
      <nav className="desktop-nav">
        <Link
          to="/"
          className="nav-link"
        >
          Home
        </Link>

        <Link
          to="/about"
          className="nav-link"
        >
          About Us
        </Link>

        <Link
          to="/stock"
          className="nav-link"
        >
          Available Stock
        </Link>

        <Link
          to="/contact"
          className="nav-link"
        >
          Contact Us
        </Link>
      </nav>

      {/* HEADER ACTIONS */}
      <div className="header-actions">

        {/* WHATSAPP */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="whatsapp-header-btn"
          aria-label="Contact us on WhatsApp"
          title="Contact us on WhatsApp"
        >
          <FaWhatsapp />

          <span>
            WhatsApp
          </span>
        </a>

        {/* WISHLIST */}
        <div
          className="wishlist-container"
          ref={wishlistRef}
        >
          <button
            type="button"
            className="header-icon-btn wishlist-btn"
            onClick={handleWishlistClick}
            aria-label="Wishlist"
            title="Wishlist"
          >
            <FaHeart />

            {wishlist.length > 0 && (
              <span className="wishlist-count">
                {wishlist.length}
              </span>
            )}
          </button>

          {/* WISHLIST DROPDOWN */}
          {showWishlist && (
            <div className="wishlist-dropdown">

              <div className="wishlist-dropdown-header">
                <h3>
                  My Wishlist
                </h3>

                <span>
                  {wishlist.length} items
                </span>
              </div>

              {wishlist.length === 0 ? (
                <div className="wishlist-empty-dropdown">
                  <FaHeart />

                  <p>
                    Your wishlist is empty.
                  </p>
                </div>
              ) : (
                <>
                  <div className="wishlist-list">
                    {wishlist.map((item) => (
                      <div
                        key={item.id}
                        className="wishlist-dropdown-item"
                        onClick={() =>
                          handleWishlistItemClick(
                            item.id
                          )
                        }
                      >
                        {(item.imageUrl ||
                          item.image) && (
                          <img
                            src={
                              item.imageUrl ||
                              item.image
                            }
                            alt={
                              item.name ||
                              "Vehicle"
                            }
                          />
                        )}

                        <div className="wishlist-item-info">
                          <h4>
                            {item.name ||
                              "Vehicle"}
                          </h4>

                          {item.price && (
                            <p>
                              {Number(
                                item.price
                              ).toLocaleString()}{" "}
                              AED
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  <Link
                    to="/wishlist"
                    className="wishlist-view-all"
                    onClick={() =>
                      setShowWishlist(false)
                    }
                  >
                    View Full Wishlist →
                  </Link>
                </>
              )}
            </div>
          )}
        </div>

        {/* ADMIN */}
        <Link
          to="/admin"
          className="header-icon-btn"
          aria-label="Admin Login"
          title="Admin Login"
        >
          <FaUser />
        </Link>

        {/* MOBILE MENU BUTTON */}
        <button
          type="button"
          className="mobile-menu"
          onClick={() =>
            setMobileMenu((prev) => !prev)
          }
          aria-label="Toggle navigation menu"
          aria-expanded={mobileMenu}
        >
          {mobileMenu ? (
            <FaTimes />
          ) : (
            <FaBars />
          )}
        </button>
      </div>

      {/* MOBILE NAVIGATION */}
      {mobileMenu && (
        <nav className="mobile-nav">

          <Link
            to="/"
            onClick={closeMobileMenu}
          >
            Home
          </Link>

          <Link
            to="/about"
            onClick={closeMobileMenu}
          >
            About Us
          </Link>

          <Link
            to="/stock"
            onClick={closeMobileMenu}
          >
            Available Stock
          </Link>

          <Link
            to="/contact"
            onClick={closeMobileMenu}
          >
            Contact Us
          </Link>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mobile-whatsapp-link"
            onClick={closeMobileMenu}
          >
            <FaWhatsapp />
            WhatsApp Contact
          </a>

          <Link
            to="/wishlist"
            onClick={closeMobileMenu}
          >
            Wishlist
          </Link>

          <Link
            to="/admin"
            onClick={closeMobileMenu}
          >
            Admin Login
          </Link>

        </nav>
      )}
    </header>
  );
};

export default Header;