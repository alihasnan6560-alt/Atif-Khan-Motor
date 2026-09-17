import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/Home.css";
import CarCard from "../components/CarCard";

const API_BASE =
  import.meta.env.VITE_API_BASE || "http://localhost:5000";

const Home = ({ searchQuery }) => {
  const [cars, setCars] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/cars`);

        const carData = Array.isArray(res.data)
          ? res.data
          : [];

        setCars(carData);
        setFeatured(carData.slice(0, 4));
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

  const featuredIds = new Set(
    featured.map((car) => car._id)
  );

  const inventoryCars = filteredCars.filter(
    (car) => !featuredIds.has(car._id)
  );

  return (
    <main className="home-container">

      {/* HERO */}
      <section className="hero-section">
        <div className="hero-content">

          <span className="hero-tag">
            PREMIUM AUTOMOTIVE COLLECTION
          </span>

          <h1>
            Luxury Cars.
            <br />
            <span>Trusted Deals.</span>
          </h1>

          <p>
            Discover premium vehicles carefully selected
            for performance, luxury, and an exceptional
            driving experience.
          </p>

          <a
            href="#inventory"
            className="cta-btn"
          >
            Explore Collection
          </a>

        </div>
      </section>

      {/* FEATURED */}
      {!loading && featured.length > 0 && (
        <section className="featured-section">

          <div className="section-heading">

            <div>
              <span className="section-label">
                HANDPICKED FOR YOU
              </span>

              <h2 className="section-title">
                Featured Cars
              </h2>
            </div>

            <a
              href="#inventory"
              className="section-link"
            >
              View Collection →
            </a>

          </div>

          <div className="cars-grid">
            {featured.map((car) => (
              <CarCard
                key={car._id}
                car={car}
              />
            ))}
          </div>

        </section>
      )}

      {/* INVENTORY */}
      <section
        id="inventory"
        className="inventory-section"
      >

        <div className="section-heading">

          <div>
            <span className="section-label">
              OUR INVENTORY
            </span>

            <h2 className="section-title">
              Available Cars
            </h2>
          </div>

          <span className="inventory-count">
            {inventoryCars.length}{" "}
            {inventoryCars.length === 1
              ? "Vehicle"
              : "Vehicles"}
          </span>

        </div>

        {loading ? (
          <div className="loading-state">
            <div className="loading-spinner"></div>

            <p>
              Loading our collection...
            </p>
          </div>
        ) : inventoryCars.length > 0 ? (
          <div className="cars-grid">

            {inventoryCars.map((car) => (
              <CarCard
                key={car._id}
                car={car}
              />
            ))}

          </div>
        ) : (
          <div className="empty-state">

            <h3>
              {query
                ? "No cars found"
                : "Featured vehicles are currently displayed above"}
            </h3>

            <p>
              {query
                ? `We couldn't find a vehicle matching "${searchQuery}".`
                : "Check back soon for more vehicles in our inventory."}
            </p>

          </div>
        )}

      </section>

    </main>
  );
};

export default Home;