import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

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
  FaWhatsapp,
} from "react-icons/fa";

import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

import "../styles/CarDetails.css";

const API_BASE =
  import.meta.env.VITE_API_BASE || "http://localhost:5000";

const WHATSAPP_NUMBER = "923045462472";

const CarDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(false);
  const [wish, setWish] = useState(false);
  const [activeImage, setActiveImage] = useState(0);

  /* =====================================================
     FETCH VEHICLE
     ===================================================== */

  useEffect(() => {
    const fetchCar = async () => {
      try {
        setLoading(true);
        setFetchError(false);

        const res = await axios.get(
          `${API_BASE}/api/cars/${id}`
        );

        setCar(res.data);

        try {
          const savedWishlist =
            JSON.parse(
              localStorage.getItem("wishlist")
            ) || [];

          setWish(
            savedWishlist.some(
              (item) => item.id === res.data._id
            )
          );
        } catch (wishlistError) {
          console.warn(
            "Wishlist data could not be read:",
            wishlistError
          );

          setWish(false);
        }
      } catch (err) {
        console.error(
          "Error fetching vehicle:",
          err
        );

        setCar(null);
        setFetchError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchCar();
  }, [id]);

  /* =====================================================
     DYNAMIC PAGE TITLE
     ===================================================== */

  useEffect(() => {
    if (car?.name) {
      document.title = `${car.name} | HASNAIN AUTOMOTIVE`;
    } else {
      document.title = "Vehicle Details | HASNAIN AUTOMOTIVE";
    }

    return () => {
      document.title = "HASNAIN AUTOMOTIVE";
    };
  }, [car]);

  /* =====================================================
     GALLERY
     ===================================================== */

  const galleryImages = useMemo(() => {
    if (!car) return [];

    const images = [
      car.imageUrl,
      ...(Array.isArray(car.images)
        ? car.images
        : []),
    ];

    return [
      ...new Set(
        images.filter(
          (image) =>
            typeof image === "string" &&
            image.trim()
        )
      ),
    ];
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
      image.startsWith("/")
        ? image
        : `/${image}`
    }`;
  };

  /* =====================================================
     FORMATTING HELPERS
     ===================================================== */

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

  /* =====================================================
     DESCRIPTION FORMATTER
     ===================================================== */

  const descriptionContent = useMemo(() => {
    if (!car?.description) {
      return [
        {
          type: "text",
          content:
            "No description available for this vehicle.",
        },
      ];
    }

    const lines = String(car.description)
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean);

    if (!lines.length) {
      return [
        {
          type: "text",
          content:
            "No description available for this vehicle.",
        },
      ];
    }

    return lines.map((line) => {
      const colonIndex = line.indexOf(":");

      if (
        colonIndex > 0 &&
        colonIndex < line.length - 1
      ) {
        return {
          type: "detail",
          label: line
            .slice(0, colonIndex)
            .trim(),
          value: line
            .slice(colonIndex + 1)
            .trim(),
        };
      }

      return {
        type: "text",
        content: line,
      };
    });
  }, [car]);

  /* =====================================================
     WISHLIST
     ===================================================== */

  const toggle = () => {
    if (!car) return;

    let list = [];

    try {
      list =
        JSON.parse(
          localStorage.getItem("wishlist")
        ) || [];
    } catch (error) {
      console.warn(
        "Invalid wishlist data. Resetting wishlist."
      );

      list = [];
    }

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

  /* =====================================================
     IMAGE NAVIGATION
     ===================================================== */

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

  /* =====================================================
     KEYBOARD GALLERY NAVIGATION
     ===================================================== */

  useEffect(() => {
    if (galleryImages.length <= 1) return;

    const handleKeyDown = (event) => {
      if (event.key === "ArrowLeft") {
        previousImage();
      }

      if (event.key === "ArrowRight") {
        nextImage();
      }
    };

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [galleryImages.length]);

  /* =====================================================
     WHATSAPP INQUIRY
     ===================================================== */

  const handleInquiry = () => {
    if (!car) return;

    const message =
      `Hello HASNAIN AUTOMOTIVE,\n\n` +
      `I am interested in the ${car.name} listed on your website.\n\n` +
      `Price: ${formatNumber(car.price)} AED\n` +
      `Year: ${car.year || "N/A"}\n` +
      `Location: ${car.location || "N/A"}\n\n` +
      `Please share more details about this vehicle.`;

    const whatsappUrl =
      `https://wa.me/${WHATSAPP_NUMBER}?text=` +
      encodeURIComponent(message);

    window.open(
      whatsappUrl,
      "_blank",
      "noopener,noreferrer"
    );
  };

  /* =====================================================
     LOADING
     ===================================================== */

  if (loading) {
    return (
      <div className="details-loading">
        <div className="details-loader"></div>

        <p>
          Loading vehicle details...
        </p>
      </div>
    );
  }

  /* =====================================================
     ERROR / NOT FOUND
     ===================================================== */

  if (fetchError) {
    return (
      <div className="details-not-found">
        <span>UNABLE TO LOAD VEHICLE</span>

        <h2>
          We couldn't load this vehicle right now.
        </h2>

        <button
          type="button"
          onClick={() => window.location.reload()}
          className="back-collection-btn"
        >
          Try Again
        </button>

        <button
          type="button"
          onClick={() => navigate("/stock")}
          className="back-collection-btn"
        >
          <FaArrowLeft />
          Back to Collection
        </button>
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
          onClick={() => navigate("/stock")}
          className="back-collection-btn"
        >
          <FaArrowLeft />
          Back to Collection
        </button>
      </div>
    );
  }

  /* =====================================================
     CURRENT IMAGE
     ===================================================== */

  const currentImage =
    galleryImages[activeImage] ||
    car.imageUrl;

  /* =====================================================
     SPECIFICATIONS
     ===================================================== */

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
        ? `${formatNumber(
            car.engineCC
          )} CC`
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
      value:
        car.mileage !== null &&
        car.mileage !== undefined &&
        car.mileage !== ""
          ? `${formatNumber(
              car.mileage
            )} km`
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

  /* =====================================================
     VEHICLE SUMMARY
     ===================================================== */

  const vehicleSummary = [
    {
      label: "Year",
      value: displayValue(car.year),
    },
    {
      label: "Transmission",
      value: car.transmission || "—",
    },
    {
      label: "Fuel",
      value: car.fuelType || "—",
    },
    {
      label: "Mileage",
      value:
        car.mileage !== null &&
        car.mileage !== undefined &&
        car.mileage !== ""
          ? `${formatNumber(
              car.mileage
            )} km`
          : "—",
    },
    {
      label: "Location",
      value: car.location || "—",
    },
  ];

  return (
    <main className="details-page">
      <div className="details-wrap">

        {/* =================================================
            TOP BAR
            ================================================= */}

        <div className="details-topbar">
          <button
            type="button"
            className="back-btn"
            onClick={() => navigate(-1)}
          >
            <FaArrowLeft />

            <span>
              Back to Collection
            </span>
          </button>

          <span className="details-badge">
            HASNAIN AUTOMOTIVE
          </span>
        </div>

        {/* =================================================
            HEADER
            ================================================= */}

        <header className="details-header">
          <div className="details-title-area">
            <span className="details-label">
              PREMIUM VEHICLE
            </span>

            <h1>{car.name}</h1>

            {(car.make ||
              car.model ||
              car.year) && (
              <p className="details-subtitle">
                {car.make && car.make}

                {car.make &&
                  car.model &&
                  " • "}

                {car.model &&
                  car.model}

                {(car.make ||
                  car.model) &&
                  car.year &&
                  " • "}

                {car.year &&
                  car.year}
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

        {/* =================================================
            IMAGE GALLERY
            ================================================= */}

        <section className="details-media">
          <div className="main-img">
            <img
              src={getImageUrl(
                currentImage
              )}
              alt={`${car.name} vehicle`}
            />

            {galleryImages.length > 1 && (
              <>
                <button
                  type="button"
                  className="gallery-arrow gallery-prev"
                  onClick={
                    previousImage
                  }
                  aria-label="Previous image"
                >
                  <FaChevronLeft />
                </button>

                <button
                  type="button"
                  className="gallery-arrow gallery-next"
                  onClick={
                    nextImage
                  }
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
              {galleryImages.map(
                (img, index) => (
                  <button
                    type="button"
                    key={`${img}-${index}`}
                    className={`thumb ${
                      activeImage ===
                      index
                        ? "active"
                        : ""
                    }`}
                    onClick={() =>
                      setActiveImage(
                        index
                      )
                    }
                    aria-label={`View image ${
                      index + 1
                    }`}
                  >
                    <img
                      src={getImageUrl(img)}
                      alt={`${car.name} ${
                        index + 1
                      }`}
                    />
                  </button>
                )
              )}
            </div>
          )}
        </section>

        {/* =================================================
            VEHICLE SUMMARY
            ================================================= */}

        <section className="vehicle-summary">
          {vehicleSummary.map(
            (item) => (
              <div
                className="summary-item"
                key={item.label}
              >
                <span>
                  {item.label}
                </span>

                <strong>
                  {item.value}
                </strong>
              </div>
            )
          )}
        </section>

        {/* =================================================
            PRICE + DESCRIPTION
            ================================================= */}

        <section className="details-info">
          <div className="price-block">
            <span className="info-label">
              ASKING PRICE
            </span>

            <div className="details-price">
              <span>
                {formatNumber(
                  car.price
                )}
              </span>

              <small>AED</small>
            </div>
          </div>

          <div className="info-divider"></div>

          <div className="description-block">
            <span className="info-label">
              VEHICLE DESCRIPTION
            </span>

            <div className="description-content">
              {descriptionContent.map(
                (item, index) => {
                  if (
                    item.type ===
                    "detail"
                  ) {
                    return (
                      <div
                        className="description-detail"
                        key={`${item.label}-${index}`}
                      >
                        <span>
                          {item.label}
                        </span>

                        <strong>
                          {item.value}
                        </strong>
                      </div>
                    );
                  }

                  return (
                    <p
                      key={`description-${index}`}
                    >
                      {item.content}
                    </p>
                  );
                }
              )}
            </div>
          </div>
        </section>

        {/* =================================================
            SPECIFICATIONS
            ================================================= */}

        <section className="vehicle-specs">
          <div className="section-heading">
            <span className="details-label">
              VEHICLE INFORMATION
            </span>

            <h2>
              Specifications
            </h2>

            <p>
              Everything you need to know
              about this vehicle
            </p>
          </div>

          <div className="specs-grid">
            {specifications.map(
              (spec) => (
                <div
                  className="spec-card"
                  key={spec.label}
                >
                  <div className="spec-icon">
                    {spec.icon}
                  </div>

                  <div className="spec-content">
                    <span>
                      {spec.label}
                    </span>

                    <strong>
                      {spec.value ||
                        "—"}
                    </strong>
                  </div>
                </div>
              )
            )}
          </div>
        </section>

        {/* =================================================
            ACTIONS
            ================================================= */}

        <section className="details-actions">
          <button
            type="button"
            className="inquiry-btn"
            onClick={
              handleInquiry
            }
          >
            <FaWhatsapp />

            Enquire on WhatsApp

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

        {/* =================================================
            TRUST
            ================================================= */}

        <section className="details-trust">
          <div>
            <span className="trust-number">
              01
            </span>

            <div>
              <strong>
                Premium Collection
              </strong>

              <p>
                Explore selected
                vehicles
              </p>
            </div>
          </div>

          <div>
            <span className="trust-number">
              02
            </span>

            <div>
              <strong>
                Vehicle Information
              </strong>

              <p>
                Clear details before
                inquiry
              </p>
            </div>
          </div>

          <div>
            <span className="trust-number">
              03
            </span>

            <div>
              <strong>
                Customer Assistance
              </strong>

              <p>
                Get in touch for more
                details
              </p>
            </div>
          </div>
        </section>

      </div>
    </main>
  );
};

export default CarDetails;