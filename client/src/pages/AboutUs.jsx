import React from "react";
import { Link } from "react-router-dom";

import {
  FaCar,
  FaShieldAlt,
  FaUsers,
  FaStar,
  FaArrowRight,
} from "react-icons/fa";

import "../styles/AboutUs.css";

const AboutUs = () => {
  return (
    <div className="about-page">

      {/* HERO */}
      <section className="about-hero">
        <div className="about-hero-content">
          <span className="about-eyebrow">
            ABOUT ATIF KHAN MOTORS
          </span>

          <h1>
            Driven by Quality.
            <span> Built on Trust.</span>
          </h1>

          <p>
            Atif Khan Motors is committed to providing quality vehicles,
            reliable service, and a smooth experience for every customer.
          </p>
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section className="about-main">
        <div className="about-intro-card">
          <div className="about-section-label">
            WHO WE ARE
          </div>

          <h2>
            More Than Just
            <span> a Motor Dealership</span>
          </h2>

          <p>
            At Atif Khan Motors, we believe buying a vehicle should be
            simple, transparent, and comfortable. Our focus is on
            connecting customers with quality vehicles while providing
            dependable service throughout the buying journey.
          </p>

          <p>
            Whether you are looking for your next daily driver, a premium
            vehicle, or simply need guidance before making a decision,
            our goal is to make the experience straightforward and
            customer-focused.
          </p>

          <Link
            to="/stock"
            className="about-primary-btn"
          >
            Explore Available Stock
            <FaArrowRight />
          </Link>
        </div>

        {/* STATS */}
        <div className="about-stats">
          <div className="about-stat-card">
            <FaCar />

            <h3>Quality</h3>

            <p>
              Carefully selected vehicles for our customers.
            </p>
          </div>

          <div className="about-stat-card">
            <FaShieldAlt />

            <h3>Reliability</h3>

            <p>
              A customer-focused approach built around trust.
            </p>
          </div>

          <div className="about-stat-card">
            <FaUsers />

            <h3>Customers</h3>

            <p>
              Professional assistance from inquiry to purchase.
            </p>
          </div>

          <div className="about-stat-card">
            <FaStar />

            <h3>Service</h3>

            <p>
              Dedicated support with every customer interaction.
            </p>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="about-why">
        <div className="about-why-heading">
          <span className="about-section-label">
            WHY ATIF KHAN MOTORS
          </span>

          <h2>
            Why Choose Us
          </h2>

          <p>
            Every part of our customer experience is built around
            quality, transparency, and customer satisfaction.
          </p>
        </div>

        <div className="about-focus-grid">

          <div className="about-focus-card">
            <div className="focus-number">
              01
            </div>

            <h3>
              Premium Selection
            </h3>

            <p>
              Explore a collection focused on vehicles that combine
              style, presence, comfort, and performance.
            </p>
          </div>

          <div className="about-focus-card">
            <div className="focus-number">
              02
            </div>

            <h3>
              Trusted Experience
            </h3>

            <p>
              A straightforward showroom experience designed to make
              your vehicle search simple and convenient.
            </p>
          </div>

          <div className="about-focus-card">
            <div className="focus-number">
              03
            </div>

            <h3>
              Clear Information
            </h3>

            <p>
              Get access to important vehicle details before making
              your next decision.
            </p>
          </div>

          <div className="about-focus-card">
            <div className="focus-number">
              04
            </div>

            <h3>
              Customer First
            </h3>

            <p>
              We aim to understand what each customer needs and
              provide assistance throughout the journey.
            </p>
          </div>

        </div>
      </section>

      {/* SERVICES */}
      <section className="services-section">
        <div className="services-content">

          <div className="services-intro">
            <span className="section-label">
              WHAT WE OFFER
            </span>

            <h2>
              Everything Starts
              <br />
              With The Right Car.
            </h2>

            <p>
              Whether you are looking for your next vehicle or simply
              exploring the collection, Atif Khan Motors gives you a
              clean and focused way to discover available cars.
            </p>
          </div>

          <div className="services-list">

            <div className="service-item">
              <span className="service-index">
                01
              </span>

              <div>
                <h3>
                  Vehicle Collection
                </h3>

                <p>
                  Explore currently available vehicles through our
                  online collection.
                </p>
              </div>

              <span className="service-arrow">
                →
              </span>
            </div>

            <div className="service-item">
              <span className="service-index">
                02
              </span>

              <div>
                <h3>
                  Vehicle Details
                </h3>

                <p>
                  Review individual vehicle information before
                  getting in touch.
                </p>
              </div>

              <span className="service-arrow">
                →
              </span>
            </div>

            <div className="service-item">
              <span className="service-index">
                03
              </span>

              <div>
                <h3>
                  Customer Assistance
                </h3>

                <p>
                  Get in contact with the dealership for further
                  information about a vehicle.
                </p>
              </div>

              <span className="service-arrow">
                →
              </span>
            </div>

          </div>
        </div>
      </section>

      {/* MISSION */}
      <section className="about-mission">
        <div className="mission-content">
          <span className="about-section-label">
            OUR MISSION
          </span>

          <h2>
            Making Every
            <span> Vehicle Journey Better</span>
          </h2>

          <p>
            Our mission is to create a dependable automotive experience
            where customers can explore vehicles with confidence and
            receive honest, professional assistance along the way.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="about-cta">
        <div className="about-cta-content">
          <span className="about-section-label">
            FIND YOUR NEXT VEHICLE
          </span>

          <h2>
            Ready to Explore
            <span> Our Collection?</span>
          </h2>

          <p>
            Browse our available vehicles and find the one that fits
            your needs.
          </p>

          <Link
            to="/stock"
            className="about-cta-btn"
          >
            View Available Stock
            <FaArrowRight />
          </Link>
        </div>
      </section>

    </div>
  );
};

export default AboutUs;