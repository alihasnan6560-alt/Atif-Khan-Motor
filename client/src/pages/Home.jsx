import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";

import {
  FaSearch,
  FaChevronDown,
  FaTimes,
} from "react-icons/fa";

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

  // Fetch cars
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

  // Models depend on selected make
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
              Number.isFinite(year) &&
              year > 0
          )
      ),
    ].sort((a, b) => b - a);
  }, [cars]);

  // If selected model doesn't belong to selected make,
  // clear the model automatically.
  useEffect(() => {
    if (
      selectedModel &&
      !models.includes(selectedModel)
    ) {
      setSelectedModel("");
    }
  }, [models, selectedModel]);

  // Apply filters
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
        .getElementById("inventory")
        ?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
    });
  };

  // Enter key search
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  // Reset everything
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

  // Filter inventory
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
          carYear >= Number(appliedFilters.minYear));

      const matchesMaxYear =
        !appliedFilters.maxYear ||
        (Number.isFinite(carYear) &&
          carYear <= Number(appliedFilters.maxYear));

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

  return (
    <main className="home-container">

      {/* HERO SECTION */}
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
            <a
              href="#inventory"
              className="cta-btn"
            >
              Explore Collection
              <span className="cta-arrow">
                →
              </span>
            </a>

            <a
              href="/about"
              className="hero-secondary-btn"
            >
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

      {/* PREMIUM VEHICLE SEARCH */}
      <section
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

          {/* KEYWORD */}
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

          {/* MAKE */}
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

          {/* MODEL */}
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

          {/* MIN YEAR */}
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

          {/* MAX YEAR */}
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

          {/* SEARCH BUTTON */}
          <button
            type="button"
            className="vehicle-search-btn"
            onClick={handleSearch}
          >
            <FaSearch />
            <span>Search Vehicles</span>
          </button>
        </div>

        {/* RESET */}
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

      {/* INVENTORY */}
      <section
        id="inventory"
        className="inventory-section"
      >
        <div className="section-heading">
          <div>
            <span className="section-label">
              NEW ARRIVAL
            </span>

            <h2 className="section-title">
              Available Cars
            </h2>

            <p className="section-description">
              {hasFilters
                ? "Vehicles matching your search."
                : "Browse our currently available vehicles."}
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
            <div className="empty-icon">
              ⌕
            </div>

            <h3>
              {hasFilters
                ? "No vehicles found"
                : "No vehicles available"}
            </h3>

            <p>
              {hasFilters
                ? "Try adjusting your search filters to find more vehicles."
                : "Check back soon for more vehicles in our collection."}
            </p>

            {hasFilters && (
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
            )}
          </div>
        )}
      </section>

      {/* FINAL CTA */}
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

        <a
          href="#inventory"
          className="cta-btn"
        >
          View Cars

          <span className="cta-arrow">
            →
          </span>
        </a>
      </section>

    </main>
  );
};

export default Home;