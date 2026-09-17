// client/src/App.jsx
import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import Wishlist from "./pages/Wishlist";
import CarDetails from "./pages/CarDetails";
import ContactUs from "./pages/ContactUs";
import AdminLogin from "./pages/AdminLogin";
import AdminPanel from "./pages/AdminPanel";

import "./styles/App.css";

function App() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <Router>
      <div className="app-root">
        <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home searchQuery={searchQuery} />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/car/:id" element={<CarDetails />} />
            <Route path="/contact" element={<ContactUs />} />
            <Route path="/admin" element={<AdminLogin />} />
            <Route
              path="/admin-panel"
              element={
                <ProtectedRoute>
                  <AdminPanel />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
