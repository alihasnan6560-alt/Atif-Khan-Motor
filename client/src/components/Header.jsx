import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaSearch,
  FaHeart,
  FaUser,
  FaTimes,
  FaBars,
} from "react-icons/fa";
import "../styles/Header.css";

const Header = ({ searchQuery, setSearchQuery }) => {
  const navigate = useNavigate();

  const [wishlist, setWishlist] = useState([]);
  const [showWishlist, setShowWishlist] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);

  const wishlistRef = useRef(null);

  /* ================================
     LOAD WISHLIST
  ================================= */

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

  /* ================================
     CLOSE WISHLIST ON OUTSIDE CLICK
  ================================= */

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        wishlistRef.current &&
        !wishlistRef.current.contains(event.target)
      ) {
        setShowWishlist(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick
      );
    };
  }, []);

  /* ================================
     SEARCH
  ================================= */

  const handleSearch = () => {
    const value = searchQuery.trim();

    setSearchQuery(value);

    if (window.location.pathname !== "/") {
      navigate("/");
    }

    setTimeout(() => {
      const inventory =
        document.getElementById("inventory");

      if (inventory) {
        inventory.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }, 150);
  };

  const handleSearchKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleSearch();
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
  };

  /* ================================
     WISHLIST
  ================================= */

  const handleWishlistClick = () => {
    setShowWishlist((prev) => !prev);
  };

  const handleWishlistItemClick = (id) => {
    setShowWishlist(false);
    navigate(`/car/${id}`);
  };

  /* ================================
     MOBILE MENU
  ================================= */

  const closeMobileMenu = () => {
    setMobileMenu(false);
  };

  return (
    <header className="noon-header">

      {/* ================================
          BRAND
      ================================= */}

      <div className="header-brand">
        <Link
          to="/"
          className="logo-text"
          onClick={closeMobileMenu}
        >
          <span className="logo-main">
            ATIF KHAN
          </span>

          <span className="logo-sub">
            MOTORS
          </span>
        </Link>
      </div>

      {/* ================================
          SEARCH
      ================================= */}

      <div className="header-search">
        <div className="search-container">
          
          <input
            type="text"
            placeholder="Search for products..."
            value={searchQuery}
            onChange={(event) =>
              setSearchQuery(event.target.value)
            }
            onKeyDown={handleSearchKeyDown}
            aria-label="Search vehicles"
          />

          {searchQuery && (
            <button
              type="button"
              className="search-clear"
              onClick={clearSearch}
              aria-label="Clear search"
              title="Clear search"
            >
              <FaTimes />
            </button>
          )}

          <button
            type="button"
            className="search-button"
            onClick={handleSearch}
            aria-label="Search"
            title="Search"
          >
            <FaSearch />
          </button>

        </div>
      </div>

      {/* ================================
          RIGHT ACTIONS
      ================================= */}

      <div className="header-actions">

        {/* Wishlist */}

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

          {showWishlist && (
            <div className="wishlist-dropdown">

              <div className="wishlist-dropdown-header">
                <h3>My Wishlist</h3>

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
                            alt={item.name}
                          />
                        )}

                        <div className="wishlist-item-info">
                          <h4>{item.name}</h4>

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

        {/* Admin */}

        <Link
          to="/admin"
          className="header-icon-btn"
          aria-label="Admin Login"
          title="Admin Login"
        >
          <FaUser />
        </Link>

        {/* Mobile Menu */}

        <button
          type="button"
          className="mobile-menu"
          onClick={() =>
            setMobileMenu((prev) => !prev)
          }
          aria-label="Toggle menu"
        >
          {mobileMenu ? (
            <FaTimes />
          ) : (
            <FaBars />
          )}
        </button>

      </div>

      {/* ================================
          MOBILE NAVIGATION
      ================================= */}

      {mobileMenu && (
        <nav className="mobile-nav">

          <Link
            to="/"
            onClick={closeMobileMenu}
          >
            Home
          </Link>

          <Link
            to="/wishlist"
            onClick={closeMobileMenu}
          >
            Wishlist
          </Link>

          <Link
            to="/contact"
            onClick={closeMobileMenu}
          >
            Contact Us
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