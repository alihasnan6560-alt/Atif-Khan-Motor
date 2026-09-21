import React from "react";
import { Link } from "react-router-dom";

import {
  FaWhatsapp,
  FaPhoneAlt,
  FaEnvelope,
} from "react-icons/fa";

import "../styles/Footer.css";

const Footer = () => {
  const email = "alihasnan6560@gmail.com";
  const phone = "+923045462472";
  const whatsapp = "https://wa.me/923045462472";

  return (
    <footer className="site-footer">
      <div className="footer-main">

        {/* BRAND */}
        <div className="footer-brand">
          <Link to="/" className="footer-logo">
            <span>HASNAIN</span>
            <strong>AUTOMOTIVE</strong>
          </Link>

          <p>
            Your trusted destination for premium vehicles,
            quality service, and an exceptional automotive
            experience.
          </p>

          <div className="footer-socials">
            <a
              href={whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
            >
              <FaWhatsapp />
            </a>

            <a
              href={`mailto:${email}`}
              aria-label="Email"
            >
              <FaEnvelope />
            </a>

            <a
              href={`tel:${phone}`}
              aria-label="Phone"
            >
              <FaPhoneAlt />
            </a>
          </div>
        </div>

        {/* QUICK LINKS */}
        <div className="footer-column">
          <h3>Quick Links</h3>

          <div className="footer-links">
            <Link to="/">Home</Link>
            <Link to="/about">About Us</Link>
            <Link to="/stock">Available Stock</Link>
            <Link to="/wishlist">Wishlist</Link>
            <Link to="/contact">Contact Us</Link>
          </div>
        </div>

        {/* SERVICES */}
        <div className="footer-column">
          <h3>Our Services</h3>

          <div className="footer-services">
            <span>Premium Vehicles</span>
            <span>Vehicle Enquiries</span>
            <span>Customer Support</span>
            <span>Automotive Solutions</span>
          </div>
        </div>

        {/* CONTACT */}
        <div className="footer-column footer-contact">
          <h3>Contact Us</h3>

          <a href={`mailto:${email}`}>
            <FaEnvelope />
            <span>{email}</span>
          </a>

          <a href={`tel:${phone}`}>
            <FaPhoneAlt />
            <span>+92 304 546 2472</span>
          </a>

          <a
            href={whatsapp}
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaWhatsapp />
            <span>WhatsApp</span>
          </a>

          <div className="footer-location">
            <span>📍</span>
            <span>Lahore, Pakistan</span>
          </div>
        </div>
      </div>

      {/* BOTTOM */}
      <div className="footer-bottom">
        <span>
          © 2026 Hasnain Automotive. All rights reserved.
        </span>

        <span>
          Premium Vehicles • Trusted Service • Exceptional Experience
        </span>
      </div>
    </footer>
  );
};

export default Footer;