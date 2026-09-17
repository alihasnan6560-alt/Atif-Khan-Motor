// client/src/pages/AdminLogin.jsx
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/AdminLogin.css";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

const AdminLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // reset previous error

    try {
      const res = await axios.post(`${API_BASE}/api/admin/login`, { username, password });

      if (res.data.success) {
        localStorage.setItem("isAdmin", "true");
        navigate("/admin-panel");
      } else {
        setError("❌ Invalid username or password");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("❌ Unable to login. Please try again.");
    }
  };

  return (
    <div className="admin-login">
      <h2>Admin Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
      {error && <p className="error-text">{error}</p>}
    </div>
  );
};

export default AdminLogin;
