import React, { useState } from "react";
import "../styles/ContactUs.css";

import {
  FaWhatsapp,
  FaPhoneAlt,
  FaEnvelope,
  FaUser,
  FaPaperPlane,
  FaCheckCircle,
  FaMapMarkerAlt,
} from "react-icons/fa";

const ContactUs = () => {
  const email = "alihasnan6560@gmail.com";
  const phone = "+923045462472";
  const whatsapp = "https://wa.me/923045462472";

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setSubmitted(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.phone.trim() ||
      !formData.message.trim()
    ) {
      return;
    }

    // Temporary frontend submission state.
    // Backend email sending will be connected next.
    setSubmitted(true);

    setFormData({
      name: "",
      email: "",
      phone: "",
      message: "",
    });
  };

  return (
    <div className="contact-page">

      {/* Hero */}
      <section className="contact-hero">
        <div className="contact-hero-content">
          <span className="contact-eyebrow">
            GET IN TOUCH
          </span>

          <h1>
            Let's Talk About
            <span> Your Vehicle</span>
          </h1>

          <p>
            Have a question, need more information, or looking for the
            right vehicle? Send us a message and our team will get back
            to you.
          </p>
        </div>
      </section>

      {/* Contact Content */}
      <section className="contact-content">

        {/* Left - Form */}
        <div className="contact-form-card">

          <div className="form-heading">
            <span className="form-small-title">
              SEND US A MESSAGE
            </span>

            <h2>
              How can we help?
            </h2>

            <p>
              Fill out the form below and we'll get in touch with you.
            </p>
          </div>

          <form onSubmit={handleSubmit}>

            <div className="form-row">

              <div className="form-group">
                <label htmlFor="name">
                  Name
                </label>

                <div className="input-wrapper">
                  <FaUser />

                  <input
                    id="name"
                    type="text"
                    name="name"
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="email">
                  Email
                </label>

                <div className="input-wrapper">
                  <FaEnvelope />

                  <input
                    id="email"
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

            </div>

            <div className="form-group">
              <label htmlFor="phone">
                Phone Number
              </label>

              <div className="input-wrapper">
                <FaPhoneAlt />

                <input
                  id="phone"
                  type="tel"
                  name="phone"
                  placeholder="Enter your phone number"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="message">
                Message
              </label>

              <textarea
                id="message"
                name="message"
                rows="7"
                placeholder="Write your message here..."
                value={formData.message}
                onChange={handleChange}
                required
              />
            </div>

            <button
              type="submit"
              className="send-message-btn"
            >
              <span>Send Message</span>
              <FaPaperPlane />
            </button>

            {submitted && (
              <div className="form-success">
                <FaCheckCircle />

                <span>
                  Your message has been submitted successfully.
                </span>
              </div>
            )}

          </form>
        </div>

        {/* Right - Contact Info */}
        <div className="contact-info-card">

          <div className="contact-info-heading">
            <span className="form-small-title">
              CONTACT INFORMATION
            </span>

            <h2>
              We're here for you
            </h2>

            <p>
              Prefer to contact us directly? Choose any of the options
              below and we'll be happy to assist you.
            </p>
          </div>

          <div className="contact-info-list">

            {/* Email */}
            <a
              href={`mailto:${email}`}
              className="contact-info-item"
            >
              <div className="contact-info-icon">
                <FaEnvelope />
              </div>

              <div>
                <span>Email</span>
                <strong>{email}</strong>
              </div>
            </a>

            {/* Phone */}
            <a
              href={`tel:${phone}`}
              className="contact-info-item"
            >
              <div className="contact-info-icon">
                <FaPhoneAlt />
              </div>

              <div>
                <span>Phone</span>
                <strong>{phone}</strong>
              </div>
            </a>

            {/* WhatsApp */}
            <a
              href={whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="contact-info-item whatsapp-info"
            >
              <div className="contact-info-icon">
                <FaWhatsapp />
              </div>

              <div>
                <span>WhatsApp</span>
                <strong>0304 546 2472</strong>
              </div>
            </a>

          </div>

          <div className="contact-info-divider" />

          <div className="contact-direct-box">
            <FaMapMarkerAlt />

            <div>
              <h3>
                Hasnain AutoMotive
              </h3>

              <p>
                Quality vehicles, reliable service and customer-focused
                assistance.
              </p>
            </div>
          </div>

          <a
            href={whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="contact-whatsapp-btn"
          >
            <FaWhatsapp />

            <span>
              Chat with us on WhatsApp
            </span>
          </a>

        </div>

      </section>

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
          <span className="fab-label">
            WhatsApp
          </span>
        </a>

        <a
          href={`tel:${phone}`}
          className="fab call-fab"
          title="Call Us"
        >
          <FaPhoneAlt />
          <span className="fab-label">
            Call Us
          </span>
        </a>

        <a
          href={`mailto:${email}`}
          className="fab email-fab"
          title="Email Us"
        >
          <FaEnvelope />
          <span className="fab-label">
            Email Us
          </span>
        </a>

      </div>

    </div>
  );
};

export default ContactUs;