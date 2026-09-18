import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/Home.css";
import CarCard from "../components/CarCard";

const API_BASE =
  import.meta.env.VITE_API_BASE || "http://localhost:5000";

const Home = ({ searchQuery }) => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/cars`);
        const carData = Array.isArray(res.data) ? res.data : [];
        setCars(carData);
      } catch (err) {
        console.error("Error fetching cars:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, []);

  const query = (searchQuery || "").toLowerCase().trim();

  const filteredCars = cars.filter((car) =>
    (car.name || "").toLowerCase().includes(query)
  );

  return (
    <main className="home-container">

      {/* ================================
          HERO SECTION
      ================================= */}
      <section className="hero-section">
        <div className="hero-glow hero-glow-one"></div>
        <div className="hero-glow hero-glow-two"></div>

        <div className="hero-content">
          <span className="hero-tag">
            ATIF KHAN MOTORS
          </span>

          <h1>
            Find Your
            <br />
            <span>Dream Car.</span>
          </h1>

          <p>
            Explore our collection of premium vehicles
            selected for style, performance, and an
            exceptional driving experience.
          </p>

          <div className="hero-actions">
            <a href="#inventory" className="cta-btn">
              Explore Collection
              <span className="cta-arrow">→</span>
            </a>

            <a href="#why-us" className="hero-secondary-btn">
              Why Us
            </a>
          </div>
        </div>

        <div className="hero-bottom-line">
          <span>PREMIUM VEHICLES</span>
          <span className="line"></span>
          <span>EST. ATIF KHAN MOTORS</span>
        </div>
      </section>

      {/* ================================
          INVENTORY
      ================================= */}
      <section
        id="inventory"
        className="inventory-section"
      >
        <div className="section-heading">
          <div>
            <span className="section-label">
              OUR COLLECTION
            </span>

            <h2 className="section-title">
              Available Cars
            </h2>

            <p className="section-description">
              Browse our currently available vehicles.
            </p>
          </div>

          <span className="inventory-count">
            {filteredCars.length}{" "}
            {filteredCars.length === 1
              ? "Vehicle"
              : "Vehicles"}
          </span>
        </div>

        {loading ? (
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Loading our collection...</p>
          </div>
        ) : filteredCars.length > 0 ? (
          <div className="cars-grid">
            {filteredCars.map((car) => (
              <CarCard
                key={car._id}
                car={car}
              />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-icon">⌕</div>

            <h3>
              {query
                ? "No cars found"
                : "No vehicles available"}
            </h3>

            <p>
              {query
                ? `We couldn't find a vehicle matching "${searchQuery}".`
                : "Check back soon for more vehicles in our collection."}
            </p>
          </div>
        )}
      </section>

      {/* ================================
          WHY ATIF KHAN MOTORS
      ================================= */}
      <section
        id="why-us"
        className="why-section"
      >
        <div className="section-heading centered-heading">
          <span className="section-label">
            THE ATIF KHAN MOTORS EXPERIENCE
          </span>

          <h2 className="section-title">
            Why Choose Us
          </h2>

          <p className="section-description centered-description">
            A premium approach to discovering your next vehicle.
          </p>
        </div>

        <div className="benefits-grid">
          <div className="benefit-card">
            <div className="benefit-number">01</div>

            <div className="benefit-icon">◆</div>

            <h3>Premium Selection</h3>

            <p>
              Explore a collection focused on vehicles
              that combine style, presence, and performance.
            </p>
          </div>

          <div className="benefit-card">
            <div className="benefit-number">02</div>

            <div className="benefit-icon">✓</div>

            <h3>Trusted Experience</h3>

            <p>
              A straightforward showroom experience designed
              to make your vehicle search easier.
            </p>
          </div>

          <div className="benefit-card">
            <div className="benefit-number">03</div>

            <div className="benefit-icon">↗</div>

            <h3>Clear Information</h3>

            <p>
              View vehicle details and available options
              before making your next decision.
            </p>
          </div>

          <div className="benefit-card">
            <div className="benefit-number">04</div>

            <div className="benefit-icon">●</div>

            <h3>Customer Focus</h3>

            <p>
              We aim to keep the vehicle discovery process
              simple, convenient, and customer-friendly.
            </p>
          </div>
        </div>
      </section>

      {/* ================================
          SERVICES
      ================================= */}
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
              Whether you are looking for your next vehicle
              or simply exploring the collection, Atif Khan
              Motors gives you a clean and focused way to
              discover available cars.
            </p>
          </div>

          <div className="services-list">
            <div className="service-item">
              <span className="service-index">01</span>
              <div>
                <h3>Vehicle Collection</h3>
                <p>
                  Explore currently available vehicles
                  through our online collection.
                </p>
              </div>
              <span className="service-arrow">→</span>
            </div>

            <div className="service-item">
              <span className="service-index">02</span>
              <div>
                <h3>Vehicle Details</h3>
                <p>
                  Review individual vehicle information
                  before getting in touch.
                </p>
              </div>
              <span className="service-arrow">→</span>
            </div>

            <div className="service-item">
              <span className="service-index">03</span>
              <div>
                <h3>Customer Assistance</h3>
                <p>
                  Get in contact with the dealership for
                  further information about a vehicle.
                </p>
              </div>
              <span className="service-arrow">→</span>
            </div>
          </div>
        </div>
      </section>

      {/* ================================
          FINAL CTA
      ================================= */}
      <section className="final-cta">
        <div>
          <span className="section-label">
            YOUR NEXT DRIVE STARTS HERE
          </span>

          <h2>
            Ready to find
            <span> your car?</span>
          </h2>

          <p>
            Explore the available collection and discover
            your next vehicle.
          </p>
        </div>

        <a href="#inventory" className="cta-btn">
          View Cars
          <span className="cta-arrow">→</span>
        </a>
      </section>

    </main>
  );
};

export default Home;