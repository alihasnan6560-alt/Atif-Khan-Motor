
import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

import {
  FaHeart,
  FaArrowLeft,
  FaChevronLeft,
  FaChevronRight,
  FaCarSide,
  FaPalette,
  FaCalendarAlt,
  FaCogs,
  FaGasPump,
  FaTachometerAlt,
  FaRoad,
  FaUsers,
  FaDoorOpen,
  FaMapMarkerAlt,
  FaCheckCircle,
} from "react-icons/fa";

import "../styles/CarDetails.css";

const API_BASE =
  import.meta.env.VITE_API_BASE || "http://localhost:5000";

const CarDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [wish, setWish] = useState(false);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    const fetchCar = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/cars/${id}`);

        setCar(res.data);

        const list =
          JSON.parse(localStorage.getItem("wishlist")) || [];

        setWish(
          list.some((item) => item.id === res.data._id)
        );
      } catch (err) {
        console.error("Error fetching car:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCar();
  }, [id]);

  const galleryImages = useMemo(() => {
    if (!car) return [];

    const images = [
      car.imageUrl,
      ...(Array.isArray(car.images) ? car.images : []),
    ];

    return [...new Set(images.filter(Boolean))];
  }, [car]);

  const getImageUrl = (image) => {
    if (!image) return "";

    if (
      image.startsWith("http://") ||
      image.startsWith("https://")
    ) {
      return image;
    }

    return `${API_BASE}${
      image.startsWith("/") ? image : `/${image}`
    }`;
  };

  const formatNumber = (value) => {
    if (
      value === null ||
      value === undefined ||
      value === ""
    ) {
      return "—";
    }

    const number = Number(value);

    return Number.isFinite(number)
      ? number.toLocaleString()
      : value;
  };

  const displayValue = (value, suffix = "") => {
    if (
      value === null ||
      value === undefined ||
      value === ""
    ) {
      return "—";
    }

    return `${value}${suffix}`;
  };

  const toggle = () => {
    if (!car) return;

    const list =
      JSON.parse(localStorage.getItem("wishlist")) || [];

    let updated;

    if (wish) {
      updated = list.filter(
        (item) => item.id !== car._id
      );
    } else {
      updated = [
        ...list,
        {
          id: car._id,
          name: car.name,
          imageUrl: car.imageUrl,
          price: car.price,
        },
      ];
    }

    localStorage.setItem(
      "wishlist",
      JSON.stringify(updated)
    );

    setWish(!wish);
  };

  const previousImage = () => {
    if (!galleryImages.length) return;

    setActiveImage((current) =>
      current === 0
        ? galleryImages.length - 1
        : current - 1
    );
  };

  const nextImage = () => {
    if (!galleryImages.length) return;

    setActiveImage((current) =>
      current === galleryImages.length - 1
        ? 0
        : current + 1
    );
  };

  const handleInquiry = () => {
    const message = `Hello Hasnain Automotive, I am interested in the ${car.name} listed for ${formatNumber(
      car.price
    )} AED. Please share more details.`;

    if (navigator.clipboard) {
      navigator.clipboard
        .writeText(message)
        .then(() => {
          alert(
            "Inquiry message copied. You can now send it through your preferred contact method."
          );
        })
        .catch(() => {
          alert(message);
        });
    } else {
      alert(message);
    }
  };

  if (loading) {
    return (
      <div className="details-loading">
        <div className="details-loader"></div>
        <p>Loading vehicle details...</p>
      </div>
    );
  }

  if (!car) {
    return (
      <div className="details-not-found">
        <span>VEHICLE NOT FOUND</span>

        <h2>
          This vehicle is no longer available.
        </h2>

        <button
          type="button"
          onClick={() => navigate("/")}
          className="back-collection-btn"
        >
          <FaArrowLeft />
          Back to Collection
        </button>
      </div>
    );
  }

  const currentImage =
    galleryImages[activeImage] || car.imageUrl;

  const specifications = [
    {
      label: "Make",
      value: car.make,
      icon: <FaCarSide />,
    },
    {
      label: "Model",
      value: car.model,
      icon: <FaCarSide />,
    },
    {
      label: "Year",
      value: displayValue(car.year),
      icon: <FaCalendarAlt />,
    },
    {
      label: "Color",
      value: car.color,
      icon: <FaPalette />,
    },
    {
      label: "Engine CC",
      value: car.engineCC
        ? `${formatNumber(car.engineCC)} CC`
        : "—",
      icon: <FaCogs />,
    },
    {
      label: "Fuel Type",
      value: car.fuelType,
      icon: <FaGasPump />,
    },
    {
      label: "Transmission",
      value: car.transmission,
      icon: <FaCogs />,
    },
    {
      label: "Mileage",
      value: car.mileage
        ? `${formatNumber(car.mileage)} km`
        : "—",
      icon: <FaTachometerAlt />,
    },
    {
      label: "Body Type",
      value: car.bodyType,
      icon: <FaCarSide />,
    },
    {
      label: "Drive Type",
      value: car.driveType,
      icon: <FaRoad />,
    },
    {
      label: "Seats",
      value: displayValue(car.seats),
      icon: <FaUsers />,
    },
    {
      label: "Doors",
      value: displayValue(car.doors),
      icon: <FaDoorOpen />,
    },
    {
      label: "Condition",
      value: car.condition,
      icon: <FaCheckCircle />,
    },
    {
      label: "Location",
      value: car.location,
      icon: <FaMapMarkerAlt />,
    },
  ];

  return (
    <main className="details-page">
      <div className="details-wrap">

        <div className="details-topbar">
          <button
            type="button"
            className="back-btn"
            onClick={() => navigate(-1)}
          >
            <FaArrowLeft />
            <span>Back to Collection</span>
          </button>

          <span className="details-badge">
            HASNAIN AUTOMOTIVE
          </span>
        </div>

        <header className="details-header">
          <div className="details-title-area">
            <span className="details-label">
              PREMIUM VEHICLE
            </span>

            <h1>{car.name}</h1>

            {(car.make || car.model || car.year) && (
              <p className="details-subtitle">
                {car.make && car.make}
                {car.make && car.model && " • "}
                {car.model && car.model}
                {(car.make || car.model) &&
                  car.year &&
                  " • "}
                {car.year && car.year}
              </p>
            )}
          </div>

          <button
            type="button"
            aria-label={
              wish
                ? "Remove from wishlist"
                : "Add to wishlist"
            }
            className={`details-heart ${
              wish ? "active" : ""
            }`}
            onClick={toggle}
          >
            <FaHeart />
          </button>
        </header>

        <section className="details-media">
          <div className="main-img">
            <img
              src={getImageUrl(currentImage)}
              alt={car.name}
            />

            {galleryImages.length > 1 && (
              <>
                <button
                  type="button"
                  className="gallery-arrow gallery-prev"
                  onClick={previousImage}
                  aria-label="Previous image"
                >
                  <FaChevronLeft />
                </button>

                <button
                  type="button"
                  className="gallery-arrow gallery-next"
                  onClick={nextImage}
                  aria-label="Next image"
                >
                  <FaChevronRight />
                </button>

                <div className="image-counter">
                  {activeImage + 1} /{" "}
                  {galleryImages.length}
                </div>
              </>
            )}
          </div>

          {galleryImages.length > 1 && (
            <div className="thumbs">
              {galleryImages.map((img, index) => (
                <button
                  type="button"
                  key={`${img}-${index}`}
                  className={`thumb ${
                    activeImage === index
                      ? "active"
                      : ""
                  }`}
                  onClick={() =>
                    setActiveImage(index)
                  }
                >
                  <img
                    src={getImageUrl(img)}
                    alt={`${car.name} ${index + 1}`}
                  />
                </button>
              ))}
            </div>
          )}
        </section>

        <section className="details-info">
          <div className="price-block">
            <span className="info-label">
              ASKING PRICE
            </span>

            <div className="details-price">
              <span>
                {formatNumber(car.price)}
              </span>

              <small>AED</small>
            </div>
          </div>

          <div className="info-divider"></div>

          <div className="description-block">
            <span className="info-label">
              VEHICLE DESCRIPTION
            </span>

            <p>
              {car.description ||
                "No description available for this vehicle."}
            </p>
          </div>
        </section>

        <section className="vehicle-specs">
          <div className="section-heading">
            <span className="details-label">
              VEHICLE INFORMATION
            </span>

            <h2>Specifications</h2>

            <p>
              Everything you need to know about this vehicle
            </p>
          </div>

          <div className="specs-grid">
            {specifications.map((spec) => (
              <div
                className="spec-card"
                key={spec.label}
              >
                <div className="spec-icon">
                  {spec.icon}
                </div>

                <div className="spec-content">
                  <span>{spec.label}</span>

                  <strong>
                    {spec.value || "—"}
                  </strong>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="details-actions">
          <button
            type="button"
            className="inquiry-btn"
            onClick={handleInquiry}
          >
            Enquire About This Car
            <span>→</span>
          </button>

          <button
            type="button"
            className={`save-btn ${
              wish ? "saved" : ""
            }`}
            onClick={toggle}
          >
            <FaHeart />

            {wish
              ? "Saved to Wishlist"
              : "Save Vehicle"}
          </button>
        </section>

        <section className="details-trust">
          <div>
            <span className="trust-number">
              01
            </span>

            <div>
              <strong>Premium Collection</strong>
              <p>Explore selected vehicles</p>
            </div>
          </div>

          <div>
            <span className="trust-number">
              02
            </span>

            <div>
              <strong>Vehicle Information</strong>
              <p>Clear details before inquiry</p>
            </div>
          </div>

          <div>
            <span className="trust-number">
              03
            </span>

            <div>
              <strong>Customer Assistance</strong>
              <p>Get in touch for more details</p>
            </div>
          </div>
        </section>

      </div>
    </main>
  );
};

export default CarDetails;
