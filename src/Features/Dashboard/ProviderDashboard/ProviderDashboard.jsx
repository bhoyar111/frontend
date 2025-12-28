import React from "react";
import { useNavigate } from "react-router-dom";
import "./ProviderDashboard.css";

const ProviderDashboard = () => {
  const navigate = useNavigate();

  const patientClick = () => {
    navigate("/my-patient");
  };

  const consultationClick = () => {
    navigate("/appointment");
  };

  return (
    <div className="dashboard">
      <h2>Welcome back!</h2>

      <div className="cards-grid">
        {/* Patients Card */}
        <div
          className="card stat-card"
          onClick={patientClick}
          style={{ cursor: "pointer" }}
        >
          <div className="dasdhboard-icon">🧑‍⚕️</div>
          <div className="card-content">
            <p className="dash-title">Patients</p>
            <h2>20</h2>
          </div>
        </div>

        {/* Appointments Card */}
        <div className="card stat-card" onClick={consultationClick}>
          <div className="dasdhboard-icon">📅</div>
          <div className="card-content">
            <p className="dash-title">Appointments</p>

            <h3 className="dash-sub-title">Total: 20</h3>
            <h3 className="dash-sub-title">
              Completed: 20
            </h3>
            <h3 className="dash-sub-title">
              Cancelled: 20
            </h3>
            <h3 className="dash-sub-title">
              Missed: 14
            </h3>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProviderDashboard;
