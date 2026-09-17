// src/context/CarContext.js
import React, { createContext, useState, useEffect } from "react";

// Create the context
const CarContext = createContext();

// Export CarContext directly for use with useContext()
export default CarContext;

// Provider component
export const CarProvider = ({ children }) => {
  const defaultCars = [
    {
      id: 1,
      name: "Honda Civic",
      brand: "Honda",
      year: "2023",
      price: "AED 85,000",
      description:
        "Honda Civic 2023 - 1.5L Turbo, 180HP, Automatic CVT. Fuel efficient, modern interior, LED lights.",
      images: ["/images/civic1.jpg"],
    },
    {
      id: 2,
      name: "Lexus RX 350",
      brand: "Lexus",
      year: "2022",
      price: "AED 210,000",
      description:
        "Lexus RX 350 - 3.5L V6, luxury SUV, leather interior, advanced safety.",
      images: ["/images/lexus1.jpg"],
    },
    {
      id: 3,
      name: "Toyota Land Cruiser",
      brand: "Toyota",
      year: "2023",
      price: "AED 400,000",
      description:
        "Land Cruiser - powerful off-road SUV, premium interior, excellent durability.",
      images: ["/images/land1.jpg"],
    },
    {
      id: 4,
      name: "Chevrolet Camaro",
      brand: "Chevrolet",
      year: "2022",
      price: "AED 260,000",
      description:
        "Camaro - sports car with powerful V6/V8 options, sporty handling.",
      images: ["/images/camaro1.jpg"],
    },
    {
      id: 5,
      name: "Bentley Continental GT",
      brand: "Bentley",
      year: "2021",
      price: "AED 950,000",
      description:
        "Bentley Continental GT - handcrafted luxury, W12 engine, premium sound.",
      images: ["/images/bentley1.jpg"],
    },
    {
      id: 6,
      name: "Toyota Prado",
      brand: "Toyota",
      year: "2023",
      price: "AED 280,000",
      description:
        "Prado - reliable SUV, comfortable 7-seater, suitable for Dubai roads.",
      images: ["/images/prado1.jpg"],
    },
  ];

  // Load cars from localStorage, or fall back to defaultCars
  const [cars, setCars] = useState(() => {
    try {
      const stored = localStorage.getItem("cars_v1");
      return stored ? JSON.parse(stored) : defaultCars;
    } catch (error) {
      console.error("Error reading localStorage:", error);
      return defaultCars;
    }
  });

  // Sync cars to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem("cars_v1", JSON.stringify(cars));
    } catch (error) {
      console.error("Error saving to localStorage:", error);
    }
  }, [cars]);

  // Add a new car
  const addCar = (car) => {
    const newCar = { ...car, id: Date.now() };
    setCars((prev) => [newCar, ...prev]);
  };

  // Delete a car by ID
  const deleteCar = (id) => {
    setCars((prev) => prev.filter((c) => c.id !== id));
  };

  // Get a specific car by ID
  const getCarById = (id) => cars.find((c) => c.id === Number(id));

  return (
    <CarContext.Provider value={{ cars, addCar, deleteCar, getCarById }}>
      {children}
    </CarContext.Provider>
  );
};
