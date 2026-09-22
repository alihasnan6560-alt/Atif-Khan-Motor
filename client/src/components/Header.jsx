import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FaHeart,
  FaUser,
  FaTimes,
  FaBars,
  FaWhatsapp,
  FaArrowRight,
} from "react-icons/fa";
import "../styles/Header.css";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [wishlist, setWishlist] = useState([]);
  const [showWishlist, setShowWishlist] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);

  const wishlistRef = useRef(null);

  const whatsappNumber = "923045462472";

  const whatsappMessage = encodeURIComponent(
    "Hello Hasnain Automotive, I would like to inquire about a vehicle."
  );

  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  useEffect(() => {
    const loadWishlist = () => {
      try {
        const stored = JSON.parse(
          localStorage.getItem("wishlist") || "[]"
        );

        setWishlist(Array.isArray(stored) ? stored : []);
      } catch {
        setWishlist([]);
      }
    };

    loadWishlist();

    window.addEventListener("wishlistUpdated", loadWishlist);
    window.addEventListener("storage", loadWishlist);

    return () => {
      window.removeEventListener("wishlistUpdated", loadWishlist);
      window.removeEventListener("storage", loadWishlist);
    };
  }, []);

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
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  useEffect(() => {
    setShowWishlist(false);
    setMobileMenu(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileMenu ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenu]);

  const isActive = (path) => {
    if (path === "/") {
      return location.pathname === "/";
    }

    return location.pathname.startsWith(path);
  };

  const handleWishlistItemClick = (item) => {
    setShowWishlist(false);

    const id = item?.id || item?._id;

    if (id) {
      navigate(`/car/${id}`);
    }
  };

  const closeMobileMenu = () => {
    setMobileMenu(false);
  };

  return (
    <header className="ha-header">
      <div className="ha-header-inner">

        {/* LOGO */}
        <Link
          to="/"
          className="ha-logo"
          aria-label="Hasnain Automotive Home"
        >
          <span className="ha-logo-main">HASNAIN</span>
          <span className="ha-logo-line" />
          <span className="ha-logo-sub">AUTOMOTIVE</span>
        </Link>

        {/* DESKTOP NAV */}
        <nav
          className="ha-desktop-nav"
          aria-label="Primary navigation"
        >
          <Link
            to="/"
            className={`ha-nav-link ${
              isActive("/") ? "active" : ""
            }`}
          >
            Home
          </Link>

          <Link
            to="/about"
            className={`ha-nav-link ${
              isActive("/about") ? "active" : ""
            }`}
          >
            About
          </Link>

          <Link
            to="/stock"
            className={`ha-nav-link ${
              isActive("/stock") ? "active" : ""
            }`}
          >
            Collection
          </Link>

          <Link
            to="/contact"
            className={`ha-nav-link ${
              isActive("/contact") ? "active" : ""
            }`}
          >
            Contact
          </Link>
        </nav>

        {/* ACTIONS */}
        <div className="ha-actions">

          {/* WHATSAPP */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="ha-whatsapp"
            aria-label="Contact Hasnain Automotive on WhatsApp"
          >
            <FaWhatsapp />
            <span>WhatsApp</span>
          </a>

          {/* WISHLIST */}
          <div
            className="ha-wishlist-wrap"
            ref={wishlistRef}
          >
            <button
              type="button"
              className={`ha-icon-btn ${
                showWishlist ? "active" : ""
              }`}
              onClick={() =>
                setShowWishlist((prev) => !prev)
              }
              aria-label="Wishlist"
              aria-expanded={showWishlist}
            >
              <FaHeart />

              {wishlist.length > 0 && (
                <span className="ha-wishlist-count">
                  {wishlist.length > 99
                    ? "99+"
                    : wishlist.length}
                </span>
              )}
            </button>

            {showWishlist && (
              <div className="ha-wishlist-dropdown">

                <div className="ha-wishlist-top">
                  <div>
                    <span>YOUR SELECTION</span>
                    <h3>Wishlist</h3>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setShowWishlist(false)
                    }
                    aria-label="Close wishlist"
                  >
                    <FaTimes />
                  </button>
                </div>

                {wishlist.length === 0 ? (
                  <div className="ha-wishlist-empty">
                    <FaHeart />

                    <h4>No vehicles saved</h4>

                    <p>
                      Add vehicles to your wishlist
                      and they will appear here.
                    </p>

                    <Link
                      to="/stock"
                      onClick={() =>
                        setShowWishlist(false)
                      }
                    >
                      Browse Collection
                      <FaArrowRight />
                    </Link>
                  </div>
                ) : (
                  <>
                    <div className="ha-wishlist-items">
                      {wishlist
                        .slice(0, 5)
                        .map((item) => {
                          const id =
                            item.id || item._id;

                          const image =
                            item.imageUrl ||
                            item.image;

                          const name =
                            item.name || "Vehicle";

                          return (
                            <button
                              type="button"
                              key={id}
                              className="ha-wishlist-item"
                              onClick={() =>
                                handleWishlistItemClick(
                                  item
                                )
                              }
                            >
                              <div className="ha-wishlist-image">
                                {image && (
                                  <img
                                    src={image}
                                    alt={name}
                                    loading="lazy"
                                  />
                                )}
                              </div>

                              <div className="ha-wishlist-info">
                                <strong>
                                  {name}
                                </strong>

                                {item.price && (
                                  <span>
                                    {Number(
                                      item.price
                                    ).toLocaleString()}{" "}
                                    AED
                                  </span>
                                )}
                              </div>

                              <FaArrowRight />
                            </button>
                          );
                        })}
                    </div>

                    <Link
                      to="/wishlist"
                      className="ha-view-wishlist"
                      onClick={() =>
                        setShowWishlist(false)
                      }
                    >
                      View Full Wishlist
                      <FaArrowRight />
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>

          {/* ADMIN */}
          <Link
            to="/admin"
            className={`ha-icon-btn ha-admin ${
              isActive("/admin") ? "active" : ""
            }`}
            aria-label="Admin Login"
            title="Admin Login"
          >
            <FaUser />
          </Link>

          {/* MOBILE MENU */}
          <button
            type="button"
            className={`ha-menu-btn ${
              mobileMenu ? "active" : ""
            }`}
            onClick={() =>
              setMobileMenu((prev) => !prev)
            }
            aria-label={
              mobileMenu
                ? "Close menu"
                : "Open menu"
            }
            aria-expanded={mobileMenu}
          >
            {mobileMenu ? (
              <FaTimes />
            ) : (
              <FaBars />
            )}
          </button>
        </div>
      </div>

      {/* MOBILE OVERLAY */}
      {mobileMenu && (
        <div className="ha-mobile-overlay">
          <div className="ha-mobile-content">

            <div className="ha-mobile-intro">
              <span>HASNAIN AUTOMOTIVE</span>
              <small>THE COLLECTION</small>
            </div>

            <nav className="ha-mobile-nav">

              <Link
                to="/"
                className={
                  isActive("/")
                    ? "active"
                    : ""
                }
                onClick={closeMobileMenu}
              >
                <span>
                  <small>01</small>
                  Home
                </span>

                <FaArrowRight />
              </Link>

              <Link
                to="/about"
                className={
                  isActive("/about")
                    ? "active"
                    : ""
                }
                onClick={closeMobileMenu}
              >
                <span>
                  <small>02</small>
                  About Us
                </span>

                <FaArrowRight />
              </Link>

              <Link
                to="/stock"
                className={
                  isActive("/stock")
                    ? "active"
                    : ""
                }
                onClick={closeMobileMenu}
              >
                <span>
                  <small>03</small>
                  Collection
                </span>

                <FaArrowRight />
              </Link>

              <Link
                to="/contact"
                className={
                  isActive("/contact")
                    ? "active"
                    : ""
                }
                onClick={closeMobileMenu}
              >
                <span>
                  <small>04</small>
                  Contact
                </span>

                <FaArrowRight />
              </Link>

              <Link
                to="/wishlist"
                onClick={closeMobileMenu}
              >
                <span>
                  <small>05</small>
                  Wishlist

                  {wishlist.length > 0 && (
                    <b>
                      {wishlist.length}
                    </b>
                  )}
                </span>

                <FaArrowRight />
              </Link>

              <Link
                to="/admin"
                onClick={closeMobileMenu}
              >
                <span>
                  <small>06</small>
                  Admin
                </span>

                <FaArrowRight />
              </Link>
            </nav>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="ha-mobile-whatsapp"
              onClick={closeMobileMenu}
            >
              <span>
                <FaWhatsapp />
                Speak With Us
              </span>

              <FaArrowRight />
            </a>

            <div className="ha-mobile-footer">
              <span>PREMIUM VEHICLES</span>
              <span>LAHORE · PAKISTAN</span>
            </div>

          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
