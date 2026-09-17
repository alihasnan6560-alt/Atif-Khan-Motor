// client/src/pages/ContactUs.jsx
import React from "react";
import "../styles/ContactUs.css";
import { FaWhatsapp, FaPhoneAlt, FaEnvelope } from "react-icons/fa";

const ContactUs = () => {
  const email = "alihasnan6560@gmail.com";
  const phone = "+923045462472";
  const whatsapp = "https://wa.me/923045462472";

  return (
    <div className="contactus-container">
      <h1>Contact Us</h1>
      <p>
        At <strong>Atif Khan Motors</strong>, we specialize in all kinds of
        car accessories, detailing products, and vehicle enhancements — all at
        highly competitive prices. Our goal is to provide premium quality,
        reliability, and unbeatable value to every customer.
      </p>

      <div className="contactus-links">
        <a href={`mailto:${email}`} className="contact-link email">
          📧 Email: {email}
        </a>
        <a href={`tel:${phone}`} className="contact-link phone">
          📞 Call: {phone}
        </a>
        <a
          href={whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          className="contact-link whatsapp"
        >
          💬 WhatsApp: 0304 546 2472
        </a>
      </div>

      {/* Floating Contact Buttons */}
      <div className="floating-buttons">
        <a
          href={whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          className="fab whatsapp-fab"
          title="Chat on WhatsApp"
        >
          <FaWhatsapp />
          <span className="fab-label">WhatsApp</span>
        </a>

        <a href={`tel:${phone}`} className="fab call-fab" title="Call Us">
          <FaPhoneAlt />
          <span className="fab-label">Call Us</span>
        </a>

        <a href={`mailto:${email}`} className="fab email-fab" title="Email Us">
          <FaEnvelope />
          <span className="fab-label">Email Us</span>
        </a>
      </div>
    </div>
  );
};

export default ContactUs;
