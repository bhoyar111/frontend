import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import "./Patient.css";
import Service from "../Services";
import showToast from "../../../Common/Shared/Utils/ToastNotification";
import { FaArrowLeft } from "react-icons/fa";

export default function ViewDetails() {
  const { userId } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState(null);

  useEffect(() => {
    if (userId) fetchUserData(userId);
  }, [userId]);

  const fetchUserData = async (id) => {
    try {
      const response = await Service.getByIdProvider({ userId: id });
      if (response?.status === 200 && response.data) {
        const user = response.data;
        // Convert "20/05/1990" → "1990-05-20"
        let dobFormatted = "";
        if (user.dob?.includes("/")) {
          const [dd, mm, yyyy] = user.dob.split("/");
          dobFormatted = `${yyyy}-${mm}-${dd}`;
        } else {
          dobFormatted = user.dob || "";
        }

        // Populate form with existing user data
        setForm({
          firstName: user.firstName || "",
          lastName: user.lastName || "",
          fullName: user.fullName || "",
          email: user.email || "",
          mobile: user.mobile || "",
          address: user.address || "",
          gender: user.gender || "",
          dob: dobFormatted,
          role: user.role || "Patient",
          profile_pic: null
        });
      }
    } catch (err) {
      showToast(
        "error",
        err?.response?.data?.message || "Failed to fetch user"
      );
    }
  };

  if (!form) return <div className="profile-wrapper">Loadings...</div>;
  const goBack = () => {
    navigate(-1); // Go back to previous page
  };
  return (
    <div className="profile-wrapper-test">
      <div className="form-header mb-4">
        <h5>{userId ? "Patient View Details" : "Add Patient"}</h5>
        <button onClick={goBack} className="back-button">
          <FaArrowLeft style={{ marginRight: "5px", fontSize: "16px" }} />
          Back
        </button>
      </div>
      <div className="profile-details">
        <div className="profile-details-grid">
          <div>
            <h2 className="profile-name">
              {form.firstName} {form.lastName}
            </h2>
            <p className="profile-email">{form.email}</p>
          </div>
          <div>
            <label>Phone Number</label>
            {form.mobile}
          </div>
          <div>
            <label>Date Of Birth</label>
            {form.dob}
          </div>
          <div>
            <label>Gender</label>
            {form.gender}
          </div>
          <div>
            <label>Address</label>
            {form.address}
          </div>
        </div>
      </div>
      <br></br>
      <div className="profile-details">
        <br></br>
        <div >
          <h5> &nbsp;&nbsp; Number of questions saved </h5>
        </div>
        <div className="profile-details-grid">


          <div>
            <label> Total </label>
            <p className="profile-total">44</p>
          </div>
          <div>
            <label>Median</label>
            22
          </div>
          <div>
            <label>Average</label>
            22
          </div>
        </div>
      </div>
    </div>
  );
}
