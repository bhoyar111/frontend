import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Service from "./Service";
import "./ProviderDashboard.css";

const ProviderDashboard = () => {
  const navigate = useNavigate();

  const [dashboardData, setDashboardData] = useState(null);

  const [loading, setLoading] = useState(true);

  const getDashboardCount = async () => {
    try {
      const res = await Service.providerDashboardCountViews();
      if (res.status === 200) {
        setDashboardData(res?.data);
      }
    } catch (err) {
      console.error("Error fetching provider dashboard details:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getDashboardCount();
  }, []);

  const patientClick = () => {
    navigate("/my-patient");
  };

  const consultationClick = () => {
    navigate("/appointment");
  };

  if (loading) {
    return (
      <div className="dashboard">
        <h2>Loading dashboard...</h2>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="dashboard">
        <h2>No Data Available</h2>
      </div>
    );
  }

  const { totalPatients, totalAppointments, appointmentStatus } = dashboardData;

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
            <h2>{totalPatients}</h2>
          </div>
        </div>

        {/* Appointments Card */}
        <div className="card stat-card" onClick={consultationClick}>
          <div className="dasdhboard-icon">📅</div>
          <div className="card-content">
            <p className="dash-title">Appointments</p>

            <h3 className="dash-sub-title">Total: {totalAppointments}</h3>
            <h3 className="dash-sub-title">
              Completed: {appointmentStatus?.COMPLETED}
            </h3>
            <h3 className="dash-sub-title">
              Cancelled: {appointmentStatus?.CANCELLED}
            </h3>
            <h3 className="dash-sub-title">
              Missed: {appointmentStatus?.MISSED}
            </h3>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProviderDashboard;
