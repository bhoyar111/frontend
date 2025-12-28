import React from "react";
import "./ErrorPage.css";
import { useNavigate } from "react-router-dom";
const ErrorComponent = () => {
  const navigate = useNavigate();

  const handleNavigateHome = () => {
    navigate("/");
  };
  return (
    <div className="error-page">
    <h1>🚧 Oops! We&apos;re Working on It</h1>
    <p>This page is under construction. Stay tuned — it&apos;ll be live soon!</p>
      <span>
        Go back to <button className="btn error-btn" onClick={handleNavigateHome}>Home</button>
      </span>
    </div>
  );
};

export default ErrorComponent;
