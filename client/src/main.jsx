// src/index.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles/App.css"; // adjust path if you keep CSS elsewhere
import { CarProvider } from "./context/CarContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <CarProvider>
      <App />
    </CarProvider>
  </React.StrictMode>
);
