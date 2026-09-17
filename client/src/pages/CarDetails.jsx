// client/src/pages/CarDetails.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { FaHeart } from "react-icons/fa";
import "../styles/CarDetails.css";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

const CarDetails = () => {
  const { id } = useParams();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [wish, setWish] = useState(false);

  useEffect(() => {
    const fetchCar = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/cars/${id}`);
        setCar(res.data);
        const list = JSON.parse(localStorage.getItem("wishlist")) || [];
        setWish(list.some((i) => i.id === res.data._id));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCar();
  }, [id]);

  const toggle = () => {
    if (!car) return;
    const list = JSON.parse(localStorage.getItem("wishlist")) || [];
    let updated;
    if (wish) {
      updated = list.filter((i) => i.id !== car._id);
    } else {
      updated = [...list, { id: car._id, name: car.name, imageUrl: car.imageUrl, price: car.price }];
    }
    localStorage.setItem("wishlist", JSON.stringify(updated));
    setWish(!wish);
  };

  if (loading) return <p className="loading">Loading...</p>;
  if (!car) return <p className="loading">Car not found.</p>;

  return (
    <div className="details-wrap">
      <header className="details-header">
        <h1>{car.name}</h1>
        <button className={`details-heart ${wish ? "active" : ""}`} onClick={toggle}><FaHeart /></button>
      </header>

      <section className="details-media">
        <div className="main-img">
          <img src={`${API_BASE}${car.imageUrl}`} alt={car.name} />
        </div>
        {car.images && car.images.length > 0 && (
          <div className="thumbs">
            {car.images.map((img, idx) => (
              <img key={idx} src={`${API_BASE}${img}`} alt={`${car.name} ${idx + 1}`} />
            ))}
          </div>
        )}
      </section>

      <section className="details-info">
        <p className="price"><strong>Price:</strong> {car.price} AED</p>
        <p className="desc"><strong>Description:</strong> {car.description || "No description."}</p>
      </section>
    </div>
  );
};

export default CarDetails;
