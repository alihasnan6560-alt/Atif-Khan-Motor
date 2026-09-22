
import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import axios from "axios";

import {
  FaSearch,
  FaTimes,
  FaCarSide,
  FaArrowRight,
  FaWhatsapp,
} from "react-icons/fa";

import CarCard from "../components/CarCard";
import "../styles/AvailableStock.css";

const API_BASE =
  import.meta.env.VITE_API_BASE || "http://localhost:5000";

const AvailableStock = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMake, setSelectedMake] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [minYear, setMinYear] = useState("");
  const [maxYear, setMaxYear] = useState("");

  useEffect(() => {
    const fetchCars = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await axios.get(`${API_BASE}/api/cars`);

        setCars(Array.isArray(response.data) ? response.data : []);
      } catch (err) {
        console.error("Failed to load vehicles:", err);

        setError(
          "Unable to load available vehicles right now. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, []);

  const makes = useMemo(() => {
    return [...new Set(cars.map((car) => car.make).filter(Boolean))].sort();
  }, [cars]);

  const models = useMemo(() => {
    const filtered = selectedMake
      ? cars.filter((car) => car.make === selectedMake)
      : cars;

    return [
      ...new Set(filtered.map((car) => car.model).filter(Boolean)),
    ].sort();
  }, [cars, selectedMake]);

  const years = useMemo(() => {
    return [
      ...new Set(
        cars
          .map((car) => Number(car.year))
          .filter((year) => !Number.isNaN(year))
      ),
    ].sort((a, b) => b - a);
  }, [cars]);

  const filteredCars = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();

    return cars.filter((car) => {
      const searchableText = [
        car.name,
        car.make,
        car.model,
        car.year,
        car.color,
        car.fuelType,
        car.transmission,
        car.bodyType,
        car.location,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesSearch =
        !search || searchableText.includes(search);

      const matchesMake =
        !selectedMake || car.make === selectedMake;

      const matchesModel =
        !selectedModel || car.model === selectedModel;

      const carYear = Number(car.year);

      const matchesMinYear =
        !minYear || carYear >= Number(minYear);

      const matchesMaxYear =
        !maxYear || carYear <= Number(maxYear);

      return (
        matchesSearch &&
        matchesMake &&
        matchesModel &&
        matchesMinYear &&
        matchesMaxYear
      );
    });
  }, [
    cars,
    searchTerm,
    selectedMake,
    selectedModel,
    minYear,
    maxYear,
  ]);

  const resetFilters = () => {
    setSearchTerm("");
    setSelectedMake("");
    setSelectedModel("");
    setMinYear("");
    setMaxYear("");
  };

  const hasFilters =
    searchTerm ||
    selectedMake ||
    selectedModel ||
    minYear ||
    maxYear;

  const whatsappNumber = "923045462472";

  const whatsappMessage = encodeURIComponent(
    "Hello Hasnain Automotive, I would like to inquire about a vehicle."
  );

  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  return (
    <div className="available-stock-page">

      {/* HERO */}
      <section className="stock-hero">
        <div className="stock-hero-overlay"></div>

        <div className="stock-hero-content">
          <span className="stock-eyebrow">
            HASNAIN AUTOMOTIVE
          </span>

          <h1>Available Stock</h1>

          <p>
            Explore our current selection of premium vehicles
            available for enquiry.
          </p>
        </div>
      </section>

      {/* FILTER SECTION */}
      <section className="stock-search-section">
        <div className="stock-container">

          <div className="stock-search-header">
            <div>
              <span className="section-eyebrow">
                FIND YOUR VEHICLE
              </span>

              <h2>Search Our Collection</h2>

              <p>
                Use the filters below to find a vehicle that
                matches your requirements.
              </p>
            </div>

            {hasFilters && (
              <button
                type="button"
                className="reset-filters-btn"
                onClick={resetFilters}
              >
                <FaTimes />
                Reset Filters
              </button>
            )}
          </div>

          <div className="stock-filters">

            {/* SEARCH */}
            <div className="stock-filter search-filter">
              <label>Search</label>

              <div className="filter-input search-input">
                <FaSearch />

                <input
                  type="text"
                  placeholder="Search vehicle, make or model..."
                  value={searchTerm}
                  onChange={(e) =>
                    setSearchTerm(e.target.value)
                  }
                />
              </div>
            </div>

            {/* MAKE */}
            <div className="stock-filter">
              <label>Make</label>

              <select
                value={selectedMake}
                onChange={(e) => {
                  setSelectedMake(e.target.value);
                  setSelectedModel("");
                }}
              >
                <option value="">All Makes</option>

                {makes.map((make) => (
                  <option key={make} value={make}>
                    {make}
                  </option>
                ))}
              </select>
            </div>

            {/* MODEL */}
            <div className="stock-filter">
              <label>Model</label>

              <select
                value={selectedModel}
                onChange={(e) =>
                  setSelectedModel(e.target.value)
                }
              >
                <option value="">All Models</option>

                {models.map((model) => (
                  <option key={model} value={model}>
                    {model}
                  </option>
                ))}
              </select>
            </div>

            {/* MIN YEAR */}
            <div className="stock-filter">
              <label>From Year</label>

              <select
                value={minYear}
                onChange={(e) =>
                  setMinYear(e.target.value)
                }
              >
                <option value="">Any</option>

                {years.map((year) => (
                  <option key={`min-${year}`} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>

            {/* MAX YEAR */}
            <div className="stock-filter">
              <label>To Year</label>

              <select
                value={maxYear}
                onChange={(e) =>
                  setMaxYear(e.target.value)
                }
              >
                <option value="">Any</option>

                {years.map((year) => (
                  <option key={`max-${year}`} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>

          </div>
        </div>
      </section>

      {/* INVENTORY */}
      <section className="inventory-section">
        <div className="stock-container">

          <div className="inventory-heading">
            <div>
              <span className="section-eyebrow">
                OUR COLLECTION
              </span>

              <h2>Available Vehicles</h2>
            </div>

            {!loading && !error && (
              <span className="vehicle-count">
                {filteredCars.length}{" "}
                {filteredCars.length === 1
                  ? "Vehicle"
                  : "Vehicles"}
              </span>
            )}
          </div>

          {/* LOADING */}
          {loading && (
            <div className="stock-state">
              <div className="stock-loader"></div>

              <h3>Loading our collection...</h3>

              <p>
                Please wait while we fetch the latest
                available vehicles.
              </p>
            </div>
          )}

          {/* ERROR */}
          {!loading && error && (
            <div className="stock-state error-state">
              <FaCarSide />

              <h3>Unable to load vehicles</h3>

              <p>{error}</p>

              <button
                type="button"
                onClick={() => window.location.reload()}
                className="stock-retry-btn"
              >
                Try Again
              </button>
            </div>
          )}

          {/* NO RESULTS */}
          {!loading &&
            !error &&
            filteredCars.length === 0 && (
              <div className="stock-state empty-state">
                <FaCarSide />

                <h3>
                  {cars.length === 0
                    ? "No vehicles available"
                    : "No vehicles found"}
                </h3>

                <p>
                  {cars.length === 0
                    ? "Our current inventory is being updated. Please check back soon."
                    : "Try adjusting your search or filters to find another vehicle."}
                </p>

                {cars.length > 0 && hasFilters && (
                  <button
                    type="button"
                    className="stock-retry-btn"
                    onClick={resetFilters}
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            )}

          {/* CARS */}
          {!loading &&
            !error &&
            filteredCars.length > 0 && (
              <div className="stock-grid">
                {filteredCars.map((car) => (
                  <CarCard
                    key={car._id || car.id}
                    car={car}
                  />
                ))}
              </div>
            )}

        </div>
      </section>

      {/* CTA */}
      <section className="stock-cta">
        <div className="stock-cta-inner">

          <div className="stock-cta-icon">
            <FaCarSide />
          </div>

          <div className="stock-cta-content">
            <span className="section-eyebrow">
              LOOKING FOR SOMETHING SPECIFIC?
            </span>

            <h2>
              Can't Find Your Ideal Vehicle?
            </h2>

            <p>
              Contact Hasnain Automotive and let us know
              what you're looking for. Our team will be
              happy to assist with your enquiry.
            </p>
          </div>

          <div className="stock-cta-actions">

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="stock-whatsapp-btn"
            >
              <FaWhatsapp />
              WhatsApp Us
            </a>

            <Link
              to="/contact"
              className="stock-contact-btn"
            >
              Contact Us
              <FaArrowRight />
            </Link>

          </div>

        </div>
      </section>

    </div>
  );
};

export default AvailableStock;
