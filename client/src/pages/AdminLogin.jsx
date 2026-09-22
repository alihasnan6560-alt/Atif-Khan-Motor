
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  FaArrowRight,
  FaLock,
  FaUserShield,
} from "react-icons/fa";
import "../styles/AdminLogin.css";

const API_BASE =
  import.meta.env.VITE_API_BASE || "http://localhost:5000";

const AdminLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    setError("");
    setLoading(true);

    try {
      const res = await axios.post(
        `${API_BASE}/api/admin/login`,
        {
          username: username.trim(),
          password,
        }
      );

      if (res.data?.success) {
        localStorage.setItem("isAdmin", "true");
        navigate("/admin-panel");
      } else {
        setError("Invalid username or password.");
      }
    } catch (err) {
      console.error("Login error:", err);

      if (err.response?.status === 401) {
        setError("Invalid username or password.");
      } else {
        setError("Unable to connect. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="admin-login-page">
      <section className="admin-login">
        <div className="admin-login-glow" />

        <div className="admin-login-header">
          <div className="admin-login-icon">
            <FaUserShield />
          </div>

          <span className="admin-login-eyebrow">
            HASNAIN AUTOMOTIVE
          </span>

          <h1>Admin Portal</h1>

          <p>
            Secure access to your vehicle management
            dashboard.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="admin-login-form">
          <div className="admin-field">
            <label htmlFor="admin-username">Username</label>

            <div className="admin-input-wrap">
              <FaUserShield />

              <input
                id="admin-username"
                type="text"
                placeholder="Enter username"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  if (error) setError("");
                }}
                autoComplete="username"
                required
                disabled={loading}
              />
            </div>
          </div>

          <div className="admin-field">
            <label htmlFor="admin-password">Password</label>

            <div className="admin-input-wrap">
              <FaLock />

              <input
                id="admin-password"
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError("");
                }}
                autoComplete="current-password"
                required
                disabled={loading}
              />
            </div>
          </div>

          {error && (
            <div className="admin-login-error" role="alert">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="admin-login-button"
            disabled={loading}
          >
            <span>
              {loading ? "Signing In..." : "Sign In"}
            </span>

            {!loading && <FaArrowRight />}
          </button>
        </form>

        <div className="admin-login-footer">
          <span>AUTHORIZED ACCESS ONLY</span>
          <span>LAHORE · PAKISTAN</span>
        </div>
      </section>
    </main>
  );
};

export default AdminLogin;
