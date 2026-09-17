import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/AdminPanel.css";

const API_BASE =
  import.meta.env.VITE_API_BASE || "http://localhost:5000";

const API_URL = `${API_BASE}/api/cars`;

const AdminPanel = () => {
  const [cars, setCars] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    image: null,
  });

  const [loading, setLoading] = useState(false);

  const [notification, setNotification] = useState({
    message: "",
    type: "",
  });

  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchCars();
  }, []);

  /* =====================================================
     FETCH CARS
  ===================================================== */

  const fetchCars = async () => {
    try {
      const { data } = await axios.get(API_URL);

      setCars(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Fetch cars error:", err);

      showNotification("Failed to fetch cars", "error");
    }
  };

  /* =====================================================
     FORM CHANGE
  ===================================================== */

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "image") {
      setFormData((prev) => ({
        ...prev,
        image: files && files.length > 0 ? files[0] : null,
      }));

      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /* =====================================================
     SUBMIT ADD / EDIT
  ===================================================== */

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      showNotification("Please enter car name", "error");
      return;
    }

    if (formData.price === "" || Number(formData.price) <= 0) {
      showNotification("Please enter a valid price", "error");
      return;
    }

    setLoading(true);

    try {
      const fd = new FormData();

      fd.append("name", formData.name.trim());
      fd.append("price", String(formData.price));

      if (formData.image) {
        fd.append("image", formData.image);
      }

      if (editId) {
        const response = await axios.put(
          `${API_URL}/edit/${editId}`,
          fd
        );

        console.log("Update response:", response.data);

        showNotification("Car updated successfully", "success");
      } else {
        const response = await axios.post(
          `${API_URL}/add`,
          fd
        );

        console.log("Add response:", response.data);

        showNotification("Car added successfully", "success");
      }

      await fetchCars();
      resetForm();
    } catch (err) {
      console.error(
        "Save car error:",
        err.response?.data || err.message
      );

      showNotification(
        err.response?.data?.message || "Error saving car",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  /* =====================================================
     EDIT
  ===================================================== */

  const handleEdit = (car) => {
    setEditId(car._id);

    setFormData({
      name: car.name || "",
      price: car.price ?? "",
      image: null,
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  /* =====================================================
     DELETE
  ===================================================== */

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this car?")) {
      return;
    }

    try {
      await axios.delete(`${API_URL}/delete/${id}`);

      showNotification("Car deleted successfully", "success");

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
        err.response?.data?.message || "Error deleting car",
        "error"
      );
    }
  };

  /* =====================================================
     RESET FORM
  ===================================================== */

  const resetForm = () => {
    setFormData({
      name: "",
      price: "",
      image: null,
    });

    setEditId(null);

    const fileInput = document.querySelector(
      'input[name="image"]'
    );

    if (fileInput) {
      fileInput.value = "";
    }
  };

  /* =====================================================
     NOTIFICATION
  ===================================================== */

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
    }, 3000);
  };

  /* =====================================================
     LOGOUT
  ===================================================== */

  const handleLogout = () => {
    localStorage.removeItem("isAdmin");
    window.location.href = "/admin";
  };

  /* =====================================================
     IMAGE URL
  ===================================================== */

  const getImageUrl = (imageUrl) => {
    if (!imageUrl) {
      return "";
    }

    return `${API_BASE}${
      imageUrl.startsWith("/") ? imageUrl : `/${imageUrl}`
    }`;
  };

  return (
    <div className="admin-panel">
      <div className="admin-header-row">
        <h2 className="admin-title">Admin Panel</h2>

        <button
          type="button"
          className="logout-btn"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>

      {notification.message && (
        <div className={`notification ${notification.type}`}>
          {notification.message}
        </div>
      )}

      <form className="car-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Car Name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <input
          type="number"
          name="price"
          placeholder="Car Price"
          value={formData.price}
          onChange={handleChange}
          required
        />

        <input
          type="file"
          name="image"
          accept="image/*"
          onChange={handleChange}
        />

        <div className="form-actions">
          <button type="submit" disabled={loading}>
            {loading
              ? "Saving..."
              : editId
              ? "Update Car"
              : "Add Car"}
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

      <h3 className="cars-title">Available Cars</h3>

      {cars.length === 0 ? (
        <p className="loading-text">No cars added yet.</p>
      ) : (
        <div className="cars-grid">
          {cars.map((car) => (
            <div className="car-card" key={car._id}>
              {car.imageUrl ? (
                <img
                  src={getImageUrl(car.imageUrl)}
                  alt={car.name}
                  className="preview-img"
                />
              ) : (
                <div className="preview-img">
                  No Image
                </div>
              )}

              <h4>{car.name}</h4>

              <p>
                {Number(car.price).toLocaleString()} AED
              </p>

              <div className="car-actions">
                <button
                  type="button"
                  className="edit-btn"
                  onClick={() => handleEdit(car)}
                >
                  Edit
                </button>

                <button
                  type="button"
                  className="delete-btn"
                  onClick={() => handleDelete(car._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminPanel;