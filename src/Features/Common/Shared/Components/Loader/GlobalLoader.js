import React from "react";
import { useSelector } from "react-redux";
import "./GlobalLoader.css";

export default function GlobalLoader() {
  const isLoading = useSelector((state) => state.loader.global);

  if (!isLoading) return null;

  return (
    <div className="loader-overlay">
    <div className="loader-content">
      <div className="spinner"></div>
    </div>
  </div>
  );
}
