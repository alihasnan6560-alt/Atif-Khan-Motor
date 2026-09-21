import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  FaSearch,
  FaChevronDown,
  FaTimes,
  FaCar,
  FaShieldAlt,
  FaHeadset,
  FaArrowRight,
} from "react-icons/fa";
import { Link } from "react-router-dom";

import "../styles/Home.css";
import CarCard from "../components/CarCard";

const API_BASE =
  import.meta.env.VITE_API_BASE || "http://localhost:5000";

const Home = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search controls
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMake, setSelectedMake] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [minYear, setMinYear] = useState("");
  const [maxYear, setMaxYear] = useState("");

  // Applied filters
  const [appliedFilters, setAppliedFilters] = useState({
    searchTerm: "",
    make: "",
    model: "",
    minYear: "",
    maxYear: "",
  });

  // Fetch vehicles
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
        setCars([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, []);

  // Unique makes
  const makes = useMemo(() => {
    return [
      ...new Set(
        cars
          .map((car) => car.make)
          .filter(
            (value) =>
              value !== null &&
              value !== undefined &&
              String(value).trim() !== ""
          )
          .map((value) => String(value).trim())
      ),
    ].sort((a, b) => a.localeCompare(b));
  }, [cars]);

  // Models based on selected make
  const models = useMemo(() => {
    const filteredCars = selectedMake
      ? cars.filter(
          (car) =>
            String(car.make || "").trim() === selectedMake
        )
      : cars;

    return [
      ...new Set(
        filteredCars
          .map((car) => car.model)
          .filter(
            (value) =>
              value !== null &&
              value !== undefined &&
              String(value).trim() !== ""
          )
          .map((value) => String(value).trim())
      ),
    ].sort((a, b) => a.localeCompare(b));
  }, [cars, selectedMake]);

  // Available years
  const years = useMemo(() => {
    return [
      ...new Set(
        cars
          .map((car) => Number(car.year))
          .filter(
            (year) =>
              Number.isFinite(year) && year > 0
          )
      ),
    ].sort((a, b) => b - a);
  }, [cars]);

  // Clear invalid model when make changes
  useEffect(() => {
    if (
      selectedModel &&
      !models.includes(selectedModel)
    ) {
      setSelectedModel("");
    }
  }, [models, selectedModel]);

  // Apply search
  const handleSearch = () => {
    setAppliedFilters({
      searchTerm: searchTerm.trim(),
      make: selectedMake,
      model: selectedModel,
      minYear,
      maxYear,
    });

    requestAnimationFrame(() => {
      document
        .getElementById("featured-vehicles")
        ?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
    });
  };

  // Enter key
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  // Reset filters
  const handleReset = () => {
    setSearchTerm("");
    setSelectedMake("");
    setSelectedModel("");
    setMinYear("");
    setMaxYear("");

    setAppliedFilters({
      searchTerm: "",
      make: "",
      model: "",
      minYear: "",
      maxYear: "",
    });
  };

  // Filter vehicles
  const filteredCars = useMemo(() => {
    const query =
      appliedFilters.searchTerm.toLowerCase();

    return cars.filter((car) => {
      const searchableText = [
        car.name,
        car.make,
        car.model,
        car.color,
        car.bodyType,
        car.fuelType,
        car.transmission,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesSearch =
        !query ||
        searchableText.includes(query);

      const matchesMake =
        !appliedFilters.make ||
        String(car.make || "").trim() ===
          appliedFilters.make;

      const matchesModel =
        !appliedFilters.model ||
        String(car.model || "").trim() ===
          appliedFilters.model;

      const carYear = Number(car.year);

      const matchesMinYear =
        !appliedFilters.minYear ||
        (Number.isFinite(carYear) &&
          carYear >=
            Number(appliedFilters.minYear));

      const matchesMaxYear =
        !appliedFilters.maxYear ||
        (Number.isFinite(carYear) &&
          carYear <=
            Number(appliedFilters.maxYear));

      return (
        matchesSearch &&
        matchesMake &&
        matchesModel &&
        matchesMinYear &&
        matchesMaxYear
      );
    });
  }, [cars, appliedFilters]);

  const hasFilters =
    Boolean(appliedFilters.searchTerm) ||
    Boolean(appliedFilters.make) ||
    Boolean(appliedFilters.model) ||
    Boolean(appliedFilters.minYear) ||
    Boolean(appliedFilters.maxYear);

  // Home only shows a limited selection
  const featuredCars = filteredCars.slice(0, 6);

  // Dynamic vehicle categories
  const vehicleCategories = useMemo(() => {
    const categoryMap = new Map();

    cars.forEach((car) => {
      const make = String(car.make || "").trim();

      if (!make) return;

      if (!categoryMap.has(make)) {
        categoryMap.set(make, 0);
      }

      categoryMap.set(
        make,
        categoryMap.get(make) + 1
      );
    });

    return Array.from(categoryMap.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .slice(0, 6);
  }, [cars]);

  return (
    <main className="home-container">

      {/* =====================================================
          HERO
      ===================================================== */}
      <section className="hero-section">
        <div className="hero-glow hero-glow-one"></div>
        <div className="hero-glow hero-glow-two"></div>

        <div className="hero-content">
          <span className="hero-tag">
            HASNAIN AUTOMOTIVE
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
            <a
              href="#vehicle-search"
              className="cta-btn"
            >
              Explore Collection
              <span className="cta-arrow">
                →
              </span>
            </a>

            <Link
              to="/about"
              className="hero-secondary-btn"
            >
              About Us
            </Link>
          </div>
        </div>

        <div className="hero-bottom-line">
          <span>PREMIUM VEHICLES</span>
          <span className="line"></span>
          <span>HASNAIN AUTOMOTIVE</span>
        </div>
      </section>


      {/* =====================================================
          SEARCH
      ===================================================== */}
      <section
        id="vehicle-search"
        className="vehicle-search-section"
        aria-label="Vehicle Search"
      >
        <div className="vehicle-search-heading">
          <span className="section-label">
            FIND YOUR VEHICLE
          </span>

          <h2>
            Search Our Collection
          </h2>

          <p>
            Find the right vehicle using our
            selection filters.
          </p>
        </div>

        <div className="vehicle-search-panel">

          <div className="vehicle-search-field keyword-field">
            <FaSearch className="search-field-icon" />

            <input
              type="text"
              value={searchTerm}
              onChange={(event) =>
                setSearchTerm(event.target.value)
              }
              onKeyDown={handleKeyDown}
              placeholder="Search make, model or vehicle..."
              aria-label="Search make, model or vehicle"
            />
          </div>

          <div className="vehicle-search-field select-field">
            <select
              value={selectedMake}
              onChange={(event) =>
                setSelectedMake(event.target.value)
              }
              aria-label="Select make"
            >
              <option value="">
                Make
              </option>

              {makes.map((make) => (
                <option
                  key={make}
                  value={make}
                >
                  {make}
                </option>
              ))}
            </select>

            <FaChevronDown className="select-icon" />
          </div>

          <div className="vehicle-search-field select-field">
            <select
              value={selectedModel}
              onChange={(event) =>
                setSelectedModel(event.target.value)
              }
              aria-label="Select model"
            >
              <option value="">
                Model
              </option>

              {models.map((model) => (
                <option
                  key={model}
                  value={model}
                >
                  {model}
                </option>
              ))}
            </select>

            <FaChevronDown className="select-icon" />
          </div>

          <div className="vehicle-search-field select-field">
            <select
              value={minYear}
              onChange={(event) =>
                setMinYear(event.target.value)
              }
              aria-label="Minimum year"
            >
              <option value="">
                Min Year
              </option>

              {years.map((year) => (
                <option
                  key={`min-${year}`}
                  value={year}
                >
                  {year}
                </option>
              ))}
            </select>

            <FaChevronDown className="select-icon" />
          </div>

          <div className="vehicle-search-field select-field">
            <select
              value={maxYear}
              onChange={(event) =>
                setMaxYear(event.target.value)
              }
              aria-label="Maximum year"
            >
              <option value="">
                Max Year
              </option>

              {years.map((year) => (
                <option
                  key={`max-${year}`}
                  value={year}
                >
                  {year}
                </option>
              ))}
            </select>

            <FaChevronDown className="select-icon" />
          </div>

          <button
            type="button"
            className="vehicle-search-btn"
            onClick={handleSearch}
          >
            <FaSearch />
            <span>Search Vehicles</span>
          </button>
        </div>

        {hasFilters && (
          <button
            type="button"
            className="vehicle-search-reset"
            onClick={handleReset}
          >
            <FaTimes />
            Clear Filters
          </button>
        )}
      </section>


      {/* =====================================================
          FEATURED VEHICLES
      ===================================================== */}
      <section
        id="featured-vehicles"
        className="featured-section"
      >
        <div className="section-heading">
          <div>
            <span className="section-label">
              {hasFilters
                ? "SEARCH RESULTS"
                : "FEATURED COLLECTION"}
            </span>

            <h2 className="section-title">
              {hasFilters
                ? "Matching Vehicles"
                : "Featured Vehicles"}
            </h2>

            <p className="section-description">
              {hasFilters
                ? "Vehicles matching your selected search criteria."
                : "Explore a selection from our currently available collection."}
            </p>
          </div>

          <Link
            to="/stock"
            className="section-link"
          >
            View All Stock
            <FaArrowRight />
          </Link>
        </div>

        {loading ? (
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>
              Loading our collection...
            </p>
          </div>
        ) : featuredCars.length > 0 ? (
          <div className="cars-grid">
            {featuredCars.map((car) => (
              <CarCard
                key={car._id}
                car={car}
              />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-icon">
              ⌕
            </div>

            <h3>
              No vehicles found
            </h3>

            <p>
              Try adjusting your search filters
              to find available vehicles.
            </p>

            <button
              type="button"
              className="cta-btn empty-reset-btn"
              onClick={handleReset}
            >
              Clear Search
              <span className="cta-arrow">
                →
              </span>
            </button>
          </div>
        )}

        {!hasFilters && cars.length > 6 && (
          <div className="featured-bottom-link">
            <Link to="/stock">
              Explore Complete Collection
              <FaArrowRight />
            </Link>
          </div>
        )}
      </section>


      {/* =====================================================
          BROWSE BY MAKE
      ===================================================== */}
      {!loading && vehicleCategories.length > 0 && (
        <section className="browse-section">
          <div className="browse-heading">
            <div>
              <span className="section-label">
                BROWSE OUR COLLECTION
              </span>

              <h2 className="section-title">
                Explore By Make
              </h2>
            </div>

            <p>
              Discover vehicles from the makes
              currently available in our collection.
            </p>
          </div>

          <div className="browse-grid">
            {vehicleCategories.map(
              ([make, count], index) => (
                <Link
                  to="/stock"
                  key={make}
                  className="browse-card"
                >
                  <div className="browse-card-number">
                    {String(index + 1).padStart(2, "0")}
                  </div>

                  <div className="browse-card-icon">
                    <FaCar />
                  </div>

                  <div className="browse-card-content">
                    <h3>{make}</h3>

                    <span>
                      {count}{" "}
                      {count === 1
                        ? "Vehicle"
                        : "Vehicles"}
                    </span>
                  </div>

                  <FaArrowRight className="browse-card-arrow" />
                </Link>
              )
            )}
          </div>
        </section>
      )}


      {/* =====================================================
          SHORT ABOUT
      ===================================================== */}
      <section className="home-about-section">
        <div className="home-about-content">

          <div className="home-about-label">
            <span className="section-label">
              ABOUT HASNAIN AUTOMOTIVE
            </span>

            <span className="home-about-line"></span>
          </div>

          <h2>
            Driven by Quality.
            <span> Built on Trust.</span>
          </h2>

          <p>
            Hasnain Automotive is focused on providing
            quality vehicles and a straightforward
            customer experience. From exploring our
            collection to getting in touch about a
            vehicle, we keep the process simple,
            professional, and customer-focused.
          </p>

          <Link
            to="/about"
            className="text-link"
          >
            Learn More About Us
            <FaArrowRight />
          </Link>
        </div>

        <div className="home-about-stats">
          <div>
            <FaCar />
            <strong>Quality</strong>
            <span>Selected Vehicles</span>
          </div>

          <div>
            <FaShieldAlt />
            <strong>Trust</strong>
            <span>Customer Focused</span>
          </div>

          <div>
            <FaHeadset />
            <strong>Support</strong>
            <span>Professional Assistance</span>
          </div>
        </div>
      </section>


      {/* =====================================================
          SERVICES
      ===================================================== */}
      <section className="home-services-section">
        <div className="home-services-heading">
          <span className="section-label">
            OUR SERVICES
          </span>

          <h2>
            A Simpler Way to
            <span> Find Your Vehicle.</span>
          </h2>

          <p>
            Everything you need to explore our
            collection and move forward with
            confidence.
          </p>
        </div>

        <div className="home-services-grid">

          <div className="home-service-card">
            <div className="home-service-number">
              01
            </div>

            <div className="home-service-icon">
              <FaCar />
            </div>

            <h3>
              Vehicle Collection
            </h3>

            <p>
              Browse our currently available
              vehicles and explore the collection
              online.
            </p>

            <Link to="/stock">
              Explore Stock
              <FaArrowRight />
            </Link>
          </div>

          <div className="home-service-card">
            <div className="home-service-number">
              02
            </div>

            <div className="home-service-icon">
              <FaSearch />
            </div>

            <h3>
              Vehicle Information
            </h3>

            <p>
              Review important vehicle details
              before deciding which car is right
              for you.
            </p>

            <Link to="/stock">
              View Vehicles
              <FaArrowRight />
            </Link>
          </div>

          <div className="home-service-card">
            <div className="home-service-number">
              03
            </div>

            <div className="home-service-icon">
              <FaHeadset />
            </div>

            <h3>
              Customer Assistance
            </h3>

            <p>
              Get in touch with Hasnain Automotive
              for further information about a
              vehicle.
            </p>

            <Link to="/contact">
              Contact Us
              <FaArrowRight />
            </Link>
          </div>

        </div>
      </section>


      {/* =====================================================
          FINAL CTA
      ===================================================== */}
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
            Explore our available collection and
            discover your next vehicle.
          </p>
        </div>

        <Link
          to="/stock"
          className="cta-btn"
        >
          View Available Stock
          <span className="cta-arrow">
            →
          </span>
        </Link>
      </section>

    </main>
  );
};

export default Home;
