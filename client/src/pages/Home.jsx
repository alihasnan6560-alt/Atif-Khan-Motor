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

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMake, setSelectedMake] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [minYear, setMinYear] = useState("");
  const [maxYear, setMaxYear] = useState("");

  const [appliedFilters, setAppliedFilters] = useState({
    searchTerm: "",
    make: "",
    model: "",
    minYear: "",
    maxYear: "",
  });

  /* =========================
     FETCH VEHICLES
  ========================= */

  useEffect(() => {
    const fetchCars = async () => {
      try {
        setLoading(true);

        const response = await axios.get(`${API_BASE}/api/cars`);

        const data = Array.isArray(response.data)
          ? response.data
          : [];

        setCars(data);
      } catch (error) {
        console.error("Failed to fetch vehicles:", error);
        setCars([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, []);

  /* =========================
     AVAILABLE MAKES
  ========================= */

  const makes = useMemo(() => {
    return [
      ...new Set(
        cars
          .map((car) => car.make)
          .filter(Boolean)
      ),
    ].sort();
  }, [cars]);

  /* =========================
     AVAILABLE MODELS
  ========================= */

  const models = useMemo(() => {
    const sourceCars = selectedMake
      ? cars.filter(
          (car) =>
            String(car.make).toLowerCase() ===
            String(selectedMake).toLowerCase()
        )
      : cars;

    return [
      ...new Set(
        sourceCars
          .map((car) => car.model)
          .filter(Boolean)
      ),
    ].sort();
  }, [cars, selectedMake]);

  /* =========================
     AVAILABLE YEARS
  ========================= */

  const years = useMemo(() => {
    return [
      ...new Set(
        cars
          .map((car) => Number(car.year))
          .filter((year) => Number.isFinite(year))
      ),
    ].sort((a, b) => b - a);
  }, [cars]);

  /* =========================
     RESET INVALID MODEL
  ========================= */

  useEffect(() => {
    if (
      selectedModel &&
      selectedMake &&
      !models.includes(selectedModel)
    ) {
      setSelectedModel("");
    }
  }, [selectedMake, selectedModel, models]);

  /* =========================
     APPLY FILTERS
  ========================= */

  const handleSearch = (event) => {
    event.preventDefault();

    setAppliedFilters({
      searchTerm: searchTerm.trim(),
      make: selectedMake,
      model: selectedModel,
      minYear,
      maxYear,
    });

    setTimeout(() => {
      document
        .getElementById("featured-vehicles")
        ?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
    }, 50);
  };

  /* =========================
     RESET FILTERS
  ========================= */

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

  /* =========================
     FILTER VEHICLES
  ========================= */

  const filteredCars = useMemo(() => {
    const {
      searchTerm: appliedSearch,
      make,
      model,
      minYear: minimumYear,
      maxYear: maximumYear,
    } = appliedFilters;

    const normalizedSearch = appliedSearch.toLowerCase();

    return cars.filter((car) => {
      const searchableText = [
        car.name,
        car.make,
        car.model,
        car.color,
        car.bodyType,
        car.fuelType,
        car.transmission,
        car.driveType,
        car.condition,
        car.location,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesSearch =
        !normalizedSearch ||
        searchableText.includes(normalizedSearch);

      const matchesMake =
        !make ||
        String(car.make || "").toLowerCase() ===
          String(make).toLowerCase();

      const matchesModel =
        !model ||
        String(car.model || "").toLowerCase() ===
          String(model).toLowerCase();

      const vehicleYear = Number(car.year);

      const matchesMinYear =
        !minimumYear ||
        vehicleYear >= Number(minimumYear);

      const matchesMaxYear =
        !maximumYear ||
        vehicleYear <= Number(maximumYear);

      return (
        matchesSearch &&
        matchesMake &&
        matchesModel &&
        matchesMinYear &&
        matchesMaxYear
      );
    });
  }, [cars, appliedFilters]);

  /* =========================
     FEATURED VEHICLES
  ========================= */

  const featuredCars = filteredCars.slice(0, 6);

  /* =========================
     ACTIVE FILTER CHECK
  ========================= */

  const hasFilters =
    Boolean(appliedFilters.searchTerm) ||
    Boolean(appliedFilters.make) ||
    Boolean(appliedFilters.model) ||
    Boolean(appliedFilters.minYear) ||
    Boolean(appliedFilters.maxYear);

  /* =========================
     BROWSE BY MAKE
  ========================= */

  const vehicleCategories = useMemo(() => {
    const counts = {};

    cars.forEach((car) => {
      if (!car.make) return;

      counts[car.make] = (counts[car.make] || 0) + 1;
    });

    return Object.entries(counts)
      .map(([make, count]) => ({
        make,
        count,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);
  }, [cars]);

  /* =========================
     WHATSAPP
  ========================= */

  const handleWhatsApp = () => {
    const message = encodeURIComponent(
      "Hello Hasnain Automotive, I would like to know more about your available vehicles."
    );

    window.open(
      `https://wa.me/923045462472?text=${message}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  return (
    <main className="home-container">

      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="hero-section">
        <div className="hero-glow hero-glow-one" />
        <div className="hero-glow hero-glow-two" />

        {/* Top information */}
        <div className="hero-topbar">
          <span className="hero-eyebrow">
            <span className="hero-eyebrow-dot" />
            HASNAIN AUTOMOTIVE
          </span>

          <span className="hero-topbar-note">
            PREMIUM VEHICLE COLLECTION
          </span>
        </div>

        {/* Giant typography */}
        <div
          className="hero-giant-type"
          aria-label="Automotive Excellence"
        >
          <span className="hero-word hero-word-top">
            AUTOMOTIVE
          </span>

          <span className="hero-word hero-word-bottom">
            EXCELLENCE
            <span className="hero-period">.</span>
          </span>
        </div>

        {/* Hero copy */}
        <div className="hero-copy">
          <span className="hero-copy-label">
            CURATED. REFINED. READY.
          </span>

          <p>
            Discover a refined collection of vehicles
            selected for design, performance and presence.
          </p>

          <div className="hero-actions">
            <a
              href="#vehicle-search"
              className="cta-btn"
            >
              <span>Explore Collection</span>

              <span className="cta-arrow">
                <FaArrowRight />
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

        {/* Hard-coded hero vehicle */}
        <div
          className="hero-car-layer"
          aria-hidden="true"
        >
          <div className="hero-car-glow" />

          <img
            src="/images/hero-car.webp"
            alt=""
            className="hero-car-image"
          />

          <div className="hero-car-label">
            <span className="hero-car-label-number">
              01
            </span>

            <span className="hero-car-label-text">
              THE COLLECTION
            </span>
          </div>
        </div>

        {/* Bottom information */}
        <div className="hero-bottom-line">
          <div className="hero-bottom-item">
            <span>01</span>
            <strong>QUALITY</strong>
          </div>

          <div className="hero-bottom-item">
            <span>02</span>
            <strong>TRUST</strong>
          </div>

          <div className="hero-bottom-item">
            <span>03</span>
            <strong>EXCELLENCE</strong>
          </div>

          <div className="hero-scroll-indicator">
            <span>SCROLL TO EXPLORE</span>
            <span className="hero-scroll-line" />
          </div>
        </div>
      </section>

      {/* =====================================================
          VEHICLE SEARCH
      ===================================================== */}

      <section
        className="search-section"
        id="vehicle-search"
      >
        <div className="section-heading search-heading">
          <span className="section-kicker">
            FIND YOUR VEHICLE
          </span>

          <h2>
            Search Our
            <span> Collection.</span>
          </h2>

          <p>
            Explore our available vehicles using the filters
            below.
          </p>
        </div>

        <form
          className="vehicle-search-form"
          onSubmit={handleSearch}
        >
          {/* Keyword */}
          <div className="search-field search-keyword">
            <label htmlFor="vehicle-search-input">
              Search
            </label>

            <div className="search-input-wrapper">
              <FaSearch />

              <input
                id="vehicle-search-input"
                type="text"
                placeholder="Search vehicle, model, color..."
                value={searchTerm}
                onChange={(event) =>
                  setSearchTerm(event.target.value)
                }
              />
            </div>
          </div>

          {/* Make */}
          <div className="search-field">
            <label htmlFor="vehicle-make">
              Make
            </label>

            <div className="select-wrapper">
              <select
                id="vehicle-make"
                value={selectedMake}
                onChange={(event) =>
                  setSelectedMake(event.target.value)
                }
              >
                <option value="">All Makes</option>

                {makes.map((make) => (
                  <option
                    key={make}
                    value={make}
                  >
                    {make}
                  </option>
                ))}
              </select>

              <FaChevronDown />
            </div>
          </div>

          {/* Model */}
          <div className="search-field">
            <label htmlFor="vehicle-model">
              Model
            </label>

            <div className="select-wrapper">
              <select
                id="vehicle-model"
                value={selectedModel}
                onChange={(event) =>
                  setSelectedModel(event.target.value)
                }
                disabled={!models.length}
              >
                <option value="">All Models</option>

                {models.map((model) => (
                  <option
                    key={model}
                    value={model}
                  >
                    {model}
                  </option>
                ))}
              </select>

              <FaChevronDown />
            </div>
          </div>

          {/* Min year */}
          <div className="search-field">
            <label htmlFor="vehicle-min-year">
              Min Year
            </label>

            <div className="select-wrapper">
              <select
                id="vehicle-min-year"
                value={minYear}
                onChange={(event) =>
                  setMinYear(event.target.value)
                }
              >
                <option value="">Any</option>

                {years.map((year) => (
                  <option
                    key={`min-${year}`}
                    value={year}
                  >
                    {year}
                  </option>
                ))}
              </select>

              <FaChevronDown />
            </div>
          </div>

          {/* Max year */}
          <div className="search-field">
            <label htmlFor="vehicle-max-year">
              Max Year
            </label>

            <div className="select-wrapper">
              <select
                id="vehicle-max-year"
                value={maxYear}
                onChange={(event) =>
                  setMaxYear(event.target.value)
                }
              >
                <option value="">Any</option>

                {years.map((year) => (
                  <option
                    key={`max-${year}`}
                    value={year}
                  >
                    {year}
                  </option>
                ))}
              </select>

              <FaChevronDown />
            </div>
          </div>

          {/* Search */}
          <button
            type="submit"
            className="vehicle-search-button"
          >
            <FaSearch />
            <span>Search Vehicles</span>
          </button>
        </form>

        {hasFilters && (
          <div className="active-filters">
            <span>
              {filteredCars.length} vehicle
              {filteredCars.length !== 1 ? "s" : ""} found
            </span>

            <button
              type="button"
              onClick={handleReset}
            >
              <FaTimes />
              Clear Filters
            </button>
          </div>
        )}
      </section>

      {/* =====================================================
          FEATURED VEHICLES
      ===================================================== */}

      <section
        className="featured-section"
        id="featured-vehicles"
      >
        <div className="section-header-row">
          <div className="section-heading">
            <span className="section-kicker">
              {hasFilters
                ? "SEARCH RESULTS"
                : "OUR COLLECTION"}
            </span>

            <h2>
              {hasFilters ? (
                <>
                  Vehicles Matching
                  <span> Your Search.</span>
                </>
              ) : (
                <>
                  Featured
                  <span> Vehicles.</span>
                </>
              )}
            </h2>

            <p>
              {hasFilters
                ? "Vehicles matching your selected criteria."
                : "A selection from our carefully curated vehicle collection."}
            </p>
          </div>

          <Link
            to="/stock"
            className="view-all-link"
          >
            View All Stock
            <FaArrowRight />
          </Link>
        </div>

        {loading ? (
          <div className="vehicles-loading">
            <div className="loading-spinner" />

            <p>
              Loading available vehicles...
            </p>
          </div>
        ) : featuredCars.length > 0 ? (
          <>
            <div className="featured-grid">
              {featuredCars.map((car) => (
                <CarCard
                  key={car._id}
                  car={car}
                />
              ))}
            </div>

            {filteredCars.length > 6 && (
              <div className="collection-bottom">
                <Link
                  to="/stock"
                  className="secondary-cta"
                >
                  Explore Complete Collection
                  <FaArrowRight />
                </Link>
              </div>
            )}
          </>
        ) : (
          <div className="empty-state">
            <div className="empty-state-icon">
              <FaCar />
            </div>

            <h3>
              No Vehicles Found
            </h3>

            <p>
              We couldn't find any vehicles matching
              your selected criteria.
            </p>

            <button
              type="button"
              onClick={handleReset}
              className="secondary-cta"
            >
              Reset Search
              <FaTimes />
            </button>
          </div>
        )}
      </section>

      {/* =====================================================
          BROWSE BY MAKE
      ===================================================== */}

      {vehicleCategories.length > 0 && (
        <section className="browse-make-section">
          <div className="section-heading centered-heading">
            <span className="section-kicker">
              EXPLORE BY MAKE
            </span>

            <h2>
              Browse By
              <span> Make.</span>
            </h2>

            <p>
              Find the vehicle that matches your style
              and preferences.
            </p>
          </div>

          <div className="make-grid">
            {vehicleCategories.map(
              ({ make, count }, index) => (
                <Link
                  key={make}
                  to={`/stock?make=${encodeURIComponent(
                    make
                  )}`}
                  className="make-card"
                >
                  <span className="make-card-number">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <div className="make-card-icon">
                    <FaCar />
                  </div>

                  <div className="make-card-content">
                    <h3>{make}</h3>

                    <span>
                      {count}{" "}
                      {count === 1
                        ? "Vehicle"
                        : "Vehicles"}
                    </span>
                  </div>

                  <div className="make-card-arrow">
                    <FaArrowRight />
                  </div>
                </Link>
              )
            )}
          </div>
        </section>
      )}

      {/* =====================================================
          ABOUT / TRUST
      ===================================================== */}

      <section className="home-about-section">
        <div className="about-content">
          <span className="section-kicker">
            ABOUT HASNAIN AUTOMOTIVE
          </span>

          <h2>
            Driven by Quality.
            <br />
            <span>Built on Trust.</span>
          </h2>

          <p>
            At Hasnain Automotive, we believe buying a
            vehicle should feel as refined as the vehicle
            itself. Our collection is carefully presented
            with clear information, quality vehicles and
            customer-focused assistance.
          </p>

          <Link
            to="/about"
            className="secondary-cta"
          >
            Discover Our Story
            <FaArrowRight />
          </Link>
        </div>

        <div className="about-stats">
          <div className="about-stat">
            <strong>
              {cars.length > 0 ? cars.length : "—"}
            </strong>

            <span>
              Vehicles Available
            </span>
          </div>

          <div className="about-stat">
            <strong>
              100%
            </strong>

            <span>
              Customer Focus
            </span>
          </div>

          <div className="about-stat">
            <strong>
              24/7
            </strong>

            <span>
              Inquiry Support
            </span>
          </div>
        </div>
      </section>

      {/* =====================================================
          HOW WE HELP
      ===================================================== */}

      <section className="services-section">
        <div className="section-heading centered-heading">
          <span className="section-kicker">
            HOW WE HELP
          </span>

          <h2>
            A Better Way to
            <span> Find Your Car.</span>
          </h2>

          <p>
            Everything you need to make your vehicle
            search simple and confident.
          </p>
        </div>

        <div className="services-grid">
          <div className="service-card">
            <div className="service-icon">
              <FaCar />
            </div>

            <span className="service-number">
              01
            </span>

            <h3>
              Curated Collection
            </h3>

            <p>
              Explore a carefully presented selection of
              vehicles across different makes, models and
              specifications.
            </p>
          </div>

          <div className="service-card">
            <div className="service-icon">
              <FaShieldAlt />
            </div>

            <span className="service-number">
              02
            </span>

            <h3>
              Clear Information
            </h3>

            <p>
              Review important vehicle details before
              making an inquiry, from specifications to
              condition and location.
            </p>
          </div>

          <div className="service-card">
            <div className="service-icon">
              <FaHeadset />
            </div>

            <span className="service-number">
              03
            </span>

            <h3>
              Customer Assistance
            </h3>

            <p>
              Have a question about a vehicle? Our team
              is available to help you with your inquiry.
            </p>

            <button
              type="button"
              className="service-whatsapp-link"
              onClick={handleWhatsApp}
            >
              Talk to Us
              <FaArrowRight />
            </button>
          </div>
        </div>
      </section>

      {/* =====================================================
          FINAL CTA
      ===================================================== */}

      <section className="home-final-cta">
        <div className="final-cta-glow" />

        <div className="final-cta-content">
          <span className="section-kicker">
            YOUR NEXT VEHICLE AWAITS
          </span>

          <h2>
            Ready to Find
            <span> Your Car?</span>
          </h2>

          <p>
            Explore our available collection and discover
            a vehicle that fits your requirements.
          </p>

          <div className="final-cta-actions">
            <Link
              to="/stock"
              className="cta-btn"
            >
              <span>View Available Stock</span>

              <span className="cta-arrow">
                <FaArrowRight />
              </span>
            </Link>

            <button
              type="button"
              className="final-whatsapp-btn"
              onClick={handleWhatsApp}
            >
              WhatsApp Us
            </button>
          </div>
        </div>
      </section>

    </main>
  );
};

export default Home;