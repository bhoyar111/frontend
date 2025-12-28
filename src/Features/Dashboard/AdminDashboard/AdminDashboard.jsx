import React, { useEffect } from "react";

import "./AdminDashboard.css";

const AdminDashboard = () => {

  const getDashboardCount = async () => {
    try {
     console.log("count");
    } catch (err) {
      console.error("Error fetching dashboard details:", err);
    } finally {
      // setLoading(false);
    }
  };

  useEffect(() => {
    getDashboardCount();
  }, []);

  return (
    <>
      <h1>Dashboard</h1>
    </>
  );
};

export default AdminDashboard;
