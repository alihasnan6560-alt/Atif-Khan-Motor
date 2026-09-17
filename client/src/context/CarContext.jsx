// client/src/context/CarContext.js

import React, {
  createContext,
  useCallback,
  useEffect,
  useState,
} from "react";
import axios from "axios";

export const CarContext = createContext();

const API_BASE =
  import.meta.env.VITE_API_BASE || "http://localhost:5000";

export const CarProvider = ({ children }) => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =========================================
  // FETCH ALL CARS
  // =========================================

  const fetchCars = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(
        `${API_BASE}/api/cars`
      );

      const carData = Array.isArray(response.data)
        ? response.data
        : [];

      setCars(carData);
    } catch (err) {
      console.error("Error fetching cars:", err);

      setError(
        "Failed to load cars. Please try again later."
      );

      setCars([]);
    } finally {
      setLoading(false);
    }
  }, []);


  // =========================================
  // ADD CAR
  // =========================================

  const addCar = async (carData) => {
    try {
      setError("");

      const response = await axios.post(
        `${API_BASE}/api/cars`,
        carData
      );

      if (response.data) {
        setCars((prevCars) => [
          response.data,
          ...prevCars,
        ]);
      }

      return response.data;
    } catch (err) {
      console.error("Error adding car:", err);

      setError(
        err.response?.data?.message ||
          "Failed to add car."
      );

      throw err;
    }
  };


  // =========================================
  // UPDATE CAR
  // =========================================

  const updateCar = async (id, carData) => {
    try {
      setError("");

      const response = await axios.put(
        `${API_BASE}/api/cars/${id}`,
        carData
      );

      if (response.data) {
        setCars((prevCars) =>
          prevCars.map((car) =>
            car._id === id
              ? response.data
              : car
          )
        );
      }

      return response.data;
    } catch (err) {
      console.error("Error updating car:", err);

      setError(
        err.response?.data?.message ||
          "Failed to update car."
      );

      throw err;
    }
  };


  // =========================================
  // DELETE CAR
  // =========================================

  const deleteCar = async (id) => {
    try {
      setError("");

      await axios.delete(
        `${API_BASE}/api/cars/${id}`
      );

      setCars((prevCars) =>
        prevCars.filter(
          (car) => car._id !== id
        )
      );

      return true;
    } catch (err) {
      console.error("Error deleting car:", err);

      setError(
        err.response?.data?.message ||
          "Failed to delete car."
      );

      throw err;
    }
  };


  // =========================================
  // GET CAR BY ID
  // =========================================

  const getCarById = useCallback(
    (id) => {
      return cars.find(
        (car) => car._id === id
      );
    },
    [cars]
  );


  // =========================================
  // FETCH WHEN APP STARTS
  // =========================================

  useEffect(() => {
    fetchCars();
  }, [fetchCars]);


  // =========================================
  // CONTEXT VALUE
  // =========================================

  const contextValue = {
    cars,
    loading,
    error,

    fetchCars,
    addCar,
    updateCar,
    deleteCar,
    getCarById,
  };


  return (
    <CarContext.Provider value={contextValue}>
      {children}
    </CarContext.Provider>
  );
};