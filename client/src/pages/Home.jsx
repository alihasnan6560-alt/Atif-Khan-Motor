
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

        const carData = Array.isArray(res.data)
          ? res.data
          : [];

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

      {/* ALL CARS */}
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

            <p>
              Loading our collection...
            </p>
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

    </main>
  );
};

export default Home;

