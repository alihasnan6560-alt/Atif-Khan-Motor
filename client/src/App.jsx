
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Header from "./components/Header";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import ScrollToTop from "./ScrollToTop";

import Home from "./pages/Home";
import AboutUs from "./pages/AboutUs";
import Wishlist from "./pages/Wishlist";
import CarDetails from "./pages/CarDetails";
import ContactUs from "./pages/ContactUs";
import AdminLogin from "./pages/AdminLogin";
import AdminPanel from "./pages/AdminPanel";

import "./styles/App.css";

function App() {
  return (
    <Router>
      <ScrollToTop />

      <div className="app-root">
        <Header />

        <main className="main-content">
          <Routes>
            <Route
              path="/"
              element={<Home />}
            />

            <Route
              path="/wishlist"
              element={<Wishlist />}
            />

            <Route
              path="/car/:id"
              element={<CarDetails />}
            />

            <Route
              path="/contact"
              element={<ContactUs />}
            />
            <Route
             path="/about"
              element={<AboutUs />} />

            <Route
              path="/admin"
              element={<AdminLogin />}
            />

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