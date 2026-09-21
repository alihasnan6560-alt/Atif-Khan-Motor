import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import "../styles/AdminPanel.css";

const API_BASE =
  import.meta.env.VITE_API_BASE || "http://localhost:5000";

const API_URL = `${API_BASE}/api/cars`;

const initialForm = {
  name: "",
  make: "",
  model: "",
  year: "",
  price: "",
  color: "",
  engineCC: "",
  fuelType: "",
  transmission: "",
  mileage: "",
  bodyType: "",
  condition: "",
  driveType: "",
  seats: "",
  doors: "",
  location: "",
  description: "",
};

const AdminPanel = () => {
  const [cars, setCars] = useState([]);
  const [formData, setFormData] = useState(initialForm);

  const [mainImage, setMainImage] = useState(null);
  const [galleryImages, setGalleryImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);

  const [mainPreview, setMainPreview] = useState("");
  const [galleryPreviews, setGalleryPreviews] = useState([]);

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [editId, setEditId] = useState(null);

  const [notification, setNotification] = useState({
    message: "",
    type: "",
  });

  const mainImageRef = useRef(null);
  const galleryImagesRef = useRef(null);

  useEffect(() => {
    fetchCars();
  }, []);

  useEffect(() => {
    return () => {
      if (mainPreview) {
        URL.revokeObjectURL(mainPreview);
      }

      galleryPreviews.forEach((url) => {
        URL.revokeObjectURL(url);
      });
    };
  }, [mainPreview, galleryPreviews]);

  const fetchCars = async () => {
    try {
      setFetching(true);

      const { data } = await axios.get(API_URL);

      setCars(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Fetch cars error:", err);

      showNotification(
        err.response?.data?.message || "Failed to fetch cars",
        "error"
      );
    } finally {
      setFetching(false);
    }
  };

  const showNotification = (message, type) => {
    setNotification({
      message,
      type,
    });

    setTimeout(() => {
      setNotification({
        message: "",
        type: "",
      });
    }, 3500);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleMainImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      showNotification("Please select a valid image file.", "error");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      showNotification("Main image must be under 10MB.", "error");
      return;
    }

    setMainImage(file);

    if (mainPreview) {
      URL.revokeObjectURL(mainPreview);
    }

    setMainPreview(URL.createObjectURL(file));
  };

  const handleGalleryImagesChange = (e) => {
    const files = Array.from(e.target.files || []);

    if (!files.length) {
      return;
    }

    const validFiles = files.filter((file) => {
      if (!file.type.startsWith("image/")) {
        return false;
      }

      if (file.size > 10 * 1024 * 1024) {
        return false;
      }

      return true;
    });

    if (validFiles.length !== files.length) {
      showNotification(
        "Some files were skipped. Only images under 10MB are allowed.",
        "error"
      );
    }

    const availableSlots = 12 - existingImages.length - galleryImages.length;

    if (availableSlots <= 0) {
      showNotification(
        "Maximum 12 gallery images are allowed.",
        "error"
      );
      return;
    }

    const selectedFiles = validFiles.slice(0, availableSlots);

    if (validFiles.length > availableSlots) {
      showNotification(
        `Only ${availableSlots} more gallery image(s) can be added.`,
        "error"
      );
    }

    setGalleryImages((prev) => [...prev, ...selectedFiles]);

    const newPreviews = selectedFiles.map((file) =>
      URL.createObjectURL(file)
    );

    setGalleryPreviews((prev) => [...prev, ...newPreviews]);

    if (galleryImagesRef.current) {
      galleryImagesRef.current.value = "";
    }
  };

  const removeNewGalleryImage = (index) => {
    const preview = galleryPreviews[index];

    if (preview) {
      URL.revokeObjectURL(preview);
    }

    setGalleryImages((prev) =>
      prev.filter((_, fileIndex) => fileIndex !== index)
    );

    setGalleryPreviews((prev) =>
      prev.filter((_, previewIndex) => previewIndex !== index)
    );
  };

  const removeExistingImage = (index) => {
    setExistingImages((prev) =>
      prev.filter((_, imageIndex) => imageIndex !== index)
    );
  };

  const getImageUrl = (imageUrl) => {
    if (!imageUrl) {
      return "";
    }

    if (imageUrl.startsWith("http")) {
      return imageUrl;
    }

    return `${API_BASE}${
      imageUrl.startsWith("/") ? imageUrl : `/${imageUrl}`
    }`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      showNotification("Please enter car name.", "error");
      return;
    }

    if (!formData.price || Number(formData.price) <= 0) {
      showNotification("Please enter a valid price.", "error");
      return;
    }

    if (!editId && !mainImage) {
      showNotification("Main image is required.", "error");
      return;
    }

    setLoading(true);

    try {
      const fd = new FormData();

      Object.entries(formData).forEach(([key, value]) => {
        if (value !== "" && value !== null && value !== undefined) {
          fd.append(key, String(value));
        }
      });

      if (mainImage) {
        fd.append("image", mainImage);
      }

      galleryImages.forEach((file) => {
        fd.append("images", file);
      });

      if (editId) {
        fd.append(
          "existingImages",
          JSON.stringify(existingImages)
        );

        const response = await axios.put(
          `${API_URL}/edit/${editId}`,
          fd
        );

        console.log("Update response:", response.data);

        showNotification(
          "Car updated successfully.",
          "success"
        );
      } else {
        const response = await axios.post(
          `${API_URL}/add`,
          fd
        );

        console.log("Add response:", response.data);

        showNotification(
          "Car added successfully.",
          "success"
        );
      }

      await fetchCars();
      resetForm();
    } catch (err) {
      console.error(
        "Save car error:",
        err.response?.data || err.message
      );

      showNotification(
        err.response?.data?.message ||
          "Error saving car. Please try again.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (car) => {
    setEditId(car._id);

    setFormData({
      name: car.name || "",
      make: car.make || "",
      model: car.model || "",
      year: car.year ?? "",
      price: car.price ?? "",
      color: car.color || "",
      engineCC: car.engineCC ?? "",
      fuelType: car.fuelType || "",
      transmission: car.transmission || "",
      mileage: car.mileage ?? "",
      bodyType: car.bodyType || "",
      condition: car.condition || "",
      driveType: car.driveType || "",
      seats: car.seats ?? "",
      doors: car.doors ?? "",
      location: car.location || "",
      description: car.description || "",
    });

    setMainImage(null);

    if (mainPreview) {
      URL.revokeObjectURL(mainPreview);
    }

    setMainPreview(
      car.imageUrl ? getImageUrl(car.imageUrl) : ""
    );

    setGalleryImages([]);

    galleryPreviews.forEach((url) => {
      URL.revokeObjectURL(url);
    });

    setGalleryPreviews([]);

    setExistingImages(
      Array.isArray(car.images) ? car.images : []
    );

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this car?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await axios.delete(`${API_URL}/delete/${id}`);

      showNotification(
        "Car deleted successfully.",
        "success"
      );

      if (editId === id) {
        resetForm();
      }

      await fetchCars();
    } catch (err) {
      console.error(
        "Delete car error:",
        err.response?.data || err.message
      );

      showNotification(
        err.response?.data?.message ||
          "Error deleting car.",
        "error"
      );
    }
  };

  const resetForm = () => {
    setFormData(initialForm);

    setEditId(null);
    setMainImage(null);
    setGalleryImages([]);
    setExistingImages([]);

    if (mainPreview) {
      URL.revokeObjectURL(mainPreview);
    }

    galleryPreviews.forEach((url) => {
      URL.revokeObjectURL(url);
    });

    setMainPreview("");
    setGalleryPreviews([]);

    if (mainImageRef.current) {
      mainImageRef.current.value = "";
    }

    if (galleryImagesRef.current) {
      galleryImagesRef.current.value = "";
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("isAdmin");
    window.location.href = "/admin";
  };

  const formatPrice = (price) => {
    return Number(price || 0).toLocaleString();
  };

  const getGalleryCount = (car) => {
    return Array.isArray(car.images)
      ? car.images.length
      : 0;
  };

  return (
    <div className="admin-panel">
      <div className="admin-header-row">
        <h2 className="admin-title">
          {editId ? "Edit Vehicle" : "Admin Panel"}
        </h2>

        <button
          type="button"
          className="logout-btn"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>

      {notification.message && (
        <div
          className={`notification ${notification.type}`}
        >
          {notification.message}
        </div>
      )}

      <form
        className="car-form"
        onSubmit={handleSubmit}
      >
        {/* BASIC INFORMATION */}
        <div className="form-section">
          <div className="form-section-heading">
            <span className="section-number">01</span>

            <div>
              <h3>Basic Information</h3>
              <p>Core vehicle information</p>
            </div>
          </div>

          <div className="form-grid">
            <div className="field-group field-full">
              <label>Car Name *</label>

              <input
                type="text"
                name="name"
                placeholder="e.g. Toyota Land Cruiser"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="field-group">
              <label>Make / Brand</label>

              <input
                type="text"
                name="make"
                placeholder="e.g. Toyota"
                value={formData.make}
                onChange={handleChange}
              />
            </div>

            <div className="field-group">
              <label>Model</label>

              <input
                type="text"
                name="model"
                placeholder="e.g. Land Cruiser"
                value={formData.model}
                onChange={handleChange}
              />
            </div>

            <div className="field-group">
              <label>Model Year</label>

              <input
                type="number"
                name="year"
                placeholder="e.g. 2024"
                min="1900"
                max="2100"
                value={formData.year}
                onChange={handleChange}
              />
            </div>

            <div className="field-group">
              <label>Price (AED) *</label>

              <input
                type="number"
                name="price"
                placeholder="e.g. 200000"
                min="0"
                value={formData.price}
                onChange={handleChange}
                required
              />
            </div>

            <div className="field-group">
              <label>Color</label>

              <input
                type="text"
                name="color"
                placeholder="e.g. Pearl White"
                value={formData.color}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        {/* ENGINE & PERFORMANCE */}
        <div className="form-section">
          <div className="form-section-heading">
            <span className="section-number">02</span>

            <div>
              <h3>Engine & Performance</h3>
              <p>Mechanical and performance specifications</p>
            </div>
          </div>

          <div className="form-grid">
            <div className="field-group">
              <label>Engine CC</label>

              <input
                type="number"
                name="engineCC"
                placeholder="e.g. 3500"
                min="0"
                value={formData.engineCC}
                onChange={handleChange}
              />
            </div>

            <div className="field-group">
              <label>Fuel Type</label>

              <select
                name="fuelType"
                value={formData.fuelType}
                onChange={handleChange}
              >
                <option value="">
                  Select fuel type
                </option>
                <option value="Petrol">Petrol</option>
                <option value="Diesel">Diesel</option>
                <option value="Hybrid">Hybrid</option>
                <option value="Electric">Electric</option>
                <option value="Plug-in Hybrid">
                  Plug-in Hybrid
                </option>
              </select>
            </div>

            <div className="field-group">
              <label>Transmission</label>

              <select
                name="transmission"
                value={formData.transmission}
                onChange={handleChange}
              >
                <option value="">
                  Select transmission
                </option>
                <option value="Automatic">
                  Automatic
                </option>
                <option value="Manual">
                  Manual
                </option>
                <option value="CVT">CVT</option>
                <option value="DCT">DCT</option>
              </select>
            </div>

            <div className="field-group">
              <label>Mileage (KM)</label>

              <input
                type="number"
                name="mileage"
                placeholder="e.g. 25000"
                min="0"
                value={formData.mileage}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        {/* VEHICLE DETAILS */}
        <div className="form-section">
          <div className="form-section-heading">
            <span className="section-number">03</span>

            <div>
              <h3>Vehicle Details</h3>
              <p>Body, condition and registration information</p>
            </div>
          </div>

          <div className="form-grid">
            <div className="field-group">
              <label>Body Type</label>

              <select
                name="bodyType"
                value={formData.bodyType}
                onChange={handleChange}
              >
                <option value="">
                  Select body type
                </option>
                <option value="Sedan">Sedan</option>
                <option value="SUV">SUV</option>
                <option value="Coupe">Coupe</option>
                <option value="Convertible">
                  Convertible
                </option>
                <option value="Hatchback">
                  Hatchback
                </option>
                <option value="Pickup">Pickup</option>
                <option value="Van">Van</option>
                <option value="Wagon">Wagon</option>
              </select>
            </div>

            <div className="field-group">
              <label>Condition</label>

              <select
                name="condition"
                value={formData.condition}
                onChange={handleChange}
              >
                <option value="">
                  Select condition
                </option>
                <option value="Brand New">
                  Brand New
                </option>
                <option value="Used">Used</option>
                <option value="Certified Pre-Owned">
                  Certified Pre-Owned
                </option>
              </select>
            </div>

            <div className="field-group">
              <label>Drive Type</label>

              <select
                name="driveType"
                value={formData.driveType}
                onChange={handleChange}
              >
                <option value="">
                  Select drive type
                </option>
                <option value="FWD">FWD</option>
                <option value="RWD">RWD</option>
                <option value="AWD">AWD</option>
                <option value="4WD">4WD</option>
              </select>
            </div>

            <div className="field-group">
              <label>Seats</label>

              <input
                type="number"
                name="seats"
                placeholder="e.g. 5"
                min="1"
                value={formData.seats}
                onChange={handleChange}
              />
            </div>

            <div className="field-group">
              <label>Doors</label>

              <input
                type="number"
                name="doors"
                placeholder="e.g. 4"
                min="1"
                value={formData.doors}
                onChange={handleChange}
              />
            </div>

            <div className="field-group">
              <label>Registration / Location</label>

              <input
                type="text"
                name="location"
                placeholder="e.g. Dubai, UAE"
                value={formData.location}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        {/* MEDIA */}
        <div className="form-section">
          <div className="form-section-heading">
            <span className="section-number">04</span>

            <div>
              <h3>Vehicle Media</h3>
              <p>Main image and gallery images</p>
            </div>
          </div>

          <div className="media-upload-grid">
            <div className="upload-box">
              <div className="upload-heading">
                <span>Main Image</span>
                <small>Required</small>
              </div>

              <label className="file-upload">
                <input
                  ref={mainImageRef}
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={handleMainImageChange}
                />

                <span className="upload-icon">
                  +
                </span>

                <strong>
                  {mainImage
                    ? "Change Main Image"
                    : "Choose Main Image"}
                </strong>

                <small>
                  JPG, PNG, WEBP · Max 10MB
                </small>
              </label>

              {mainPreview && (
                <div className="main-preview">
                  <img
                    src={mainPreview}
                    alt="Main preview"
                  />
                </div>
              )}
            </div>

            <div className="upload-box">
              <div className="upload-heading">
                <span>Gallery Images</span>
                <small>
                  {existingImages.length +
                    galleryImages.length}
                  /12
                </small>
              </div>

              <label className="file-upload">
                <input
                  ref={galleryImagesRef}
                  type="file"
                  name="images"
                  accept="image/*"
                  multiple
                  onChange={handleGalleryImagesChange}
                />

                <span className="upload-icon">
                  +
                </span>

                <strong>
                  Add Gallery Images
                </strong>

                <small>
                  Select multiple images · Max 12
                </small>
              </label>
            </div>
          </div>

          {editId && existingImages.length > 0 && (
            <div className="gallery-management">
              <div className="gallery-title-row">
                <h4>Existing Gallery</h4>

                <span>
                  {existingImages.length} image
                  {existingImages.length !== 1
                    ? "s"
                    : ""}
                </span>
              </div>

              <div className="gallery-preview-grid">
                {existingImages.map(
                  (image, index) => (
                    <div
                      className="gallery-preview"
                      key={`${image}-${index}`}
                    >
                      <img
                        src={getImageUrl(image)}
                        alt={`Gallery ${index + 1}`}
                      />

                      <button
                        type="button"
                        className="remove-image-btn"
                        onClick={() =>
                          removeExistingImage(index)
                        }
                        aria-label="Remove image"
                      >
                        ×
                      </button>
                    </div>
                  )
                )}
              </div>
            </div>
          )}

          {galleryImages.length > 0 && (
            <div className="gallery-management">
              <div className="gallery-title-row">
                <h4>New Gallery Images</h4>

                <span>
                  {galleryImages.length} selected
                </span>
              </div>

              <div className="gallery-preview-grid">
                {galleryPreviews.map(
                  (preview, index) => (
                    <div
                      className="gallery-preview"
                      key={preview}
                    >
                      <img
                        src={preview}
                        alt={`New gallery ${
                          index + 1
                        }`}
                      />

                      <button
                        type="button"
                        className="remove-image-btn"
                        onClick={() =>
                          removeNewGalleryImage(
                            index
                          )
                        }
                        aria-label="Remove image"
                      >
                        ×
                      </button>
                    </div>
                  )
                )}
              </div>
            </div>
          )}
        </div>

        {/* DESCRIPTION */}
        <div className="form-section">
          <div className="form-section-heading">
            <span className="section-number">05</span>

            <div>
              <h3>Description</h3>
              <p>Detailed information about the vehicle</p>
            </div>
          </div>

          <div className="field-group field-full">
            <label>Full Description</label>

            <textarea
              name="description"
              rows="7"
              placeholder="Write a detailed description of the vehicle..."
              value={formData.description}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* FORM ACTIONS */}
        <div className="form-actions">
          <button
            type="submit"
            className="save-car-btn"
            disabled={loading}
          >
            {loading
              ? "Saving Vehicle..."
              : editId
              ? "Update Vehicle"
              : "Add Vehicle"}
          </button>

          {editId && (
            <button
              type="button"
              className="cancel-btn"
              onClick={resetForm}
              disabled={loading}
            >
              Cancel Edit
            </button>
          )}
        </div>
      </form>

      {/* AVAILABLE CARS */}
      <h3 className="cars-title">
        Available Vehicles
      </h3>

      {fetching ? (
        <p className="loading-text">
          Loading vehicles...
        </p>
      ) : cars.length === 0 ? (
        <p className="loading-text">
          No cars added yet.
        </p>
      ) : (
        <div className="cars-grid">
          {cars.map((car) => (
            <div
              className="car-card"
              key={car._id}
            >
              {car.imageUrl ? (
                <img
                  src={getImageUrl(car.imageUrl)}
                  alt={car.name}
                  className="preview-img"
                />
              ) : (
                <div className="preview-img no-image">
                  No Image
                </div>
              )}

              <div className="admin-card-content">
                <h3>{car.name}</h3>

                <p className="card-price">
                  {formatPrice(car.price)} AED
                </p>

                <div className="card-specs">
                  {car.make && (
                    <span>
                      {car.make}
                    </span>
                  )}

                  {car.model && (
                    <span>
                      {car.model}
                    </span>
                  )}

                  {car.year && (
                    <span>
                      {car.year}
                    </span>
                  )}

                  {car.color && (
                    <span>
                      {car.color}
                    </span>
                  )}
                </div>

                <div className="card-meta">
                  <span>
                    {getGalleryCount(car)} gallery
                    {getGalleryCount(car) !== 1
                      ? " images"
                      : " image"}
                  </span>

                  {car.engineCC && (
                    <span>
                      {Number(
                        car.engineCC
                      ).toLocaleString()}{" "}
                      CC
                    </span>
                  )}
                </div>

                <div className="car-actions">
                  <button
                    type="button"
                    className="edit-btn"
                    onClick={() =>
                      handleEdit(car)
                    }
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    className="delete-btn"
                    onClick={() =>
                      handleDelete(car._id)
                    }
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminPanel;