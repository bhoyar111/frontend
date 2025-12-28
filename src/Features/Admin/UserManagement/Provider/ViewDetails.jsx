import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

import "./Provider.css";
import Service from "../Services";
import showToast from "../../../Common/Shared/Utils/ToastNotification";

export default function ViewDetails() {
   const { userId } = useParams();
    const navigate = useNavigate();

  const [form, setForm] = useState(null);
  // const [providerSlots, setProviderSlots] = useState({});

  useEffect(() => {
    if (userId) fetchUserData(userId);
  }, [userId]);

  const fetchUserData = async (id) => {
    try {
      const response = await Service.getByIdProvider({ userId: id });
      if (response?.status === 200 && response.data) {
        const user = response.data;
        let dobFormatted = "";
        if (user.dob?.includes("/")) {
          const [dd, mm, yyyy] = user.dob.split("/");
          dobFormatted = `${yyyy}-${mm}-${dd}`;
        } else {
          dobFormatted = user.dob || "";
        }

        setForm({
          firstName: user.firstName || "",
          lastName: user.lastName || "",
          fullName: user.fullName || "",
          email: user.email || "",
          mobile: user.mobile || "",
          address: user.address || "",
          gender: user.gender || "",
          dob: dobFormatted,
          role: user.role || "Provider",
          speciality: user.speciality || "",
          experience: user.experience || "",
          about: user.about || "",
          profile_pic: null,
          availableSlot: user.availableSlot,
          licenseDetails: user.licenseDetails?.length
            ? user.licenseDetails.map((lic) => ({
                state: lic.state || "",
                license_number: lic.license_number || "",
                expiry_date: lic.expiry_date?.includes("T")
                  ? lic.expiry_date.split("T")[0]
                  : lic.expiry_date || ""
              }))
            : [{ state: "", license_number: "", expiry_date: "" }]
        });
      }
    } catch (err) {
      showToast(
        "error",
        err?.response?.data?.message || "Something went wrong"
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
            <h5>{userId ? "Provider View Details" : "Add Provider"}</h5>
            <button onClick={goBack} className="back-button">
                <FaArrowLeft style={{ marginRight: "5px", fontSize: "16px" }} />
                Back
            </button>
        </div>
      <div className="profile-details">
        <div className="profile-details-grid">
          <div>
            <h2 className="profile-name">
              Dr. {form.firstName} {form.lastName}
            </h2>
            <p className="profile-email">{form.email}</p>
          </div>
          <div>
            <label>Experience</label>
            {form.experience} years
          </div>
          <div>
            <label>Specialities</label>
            {form.speciality?.length > 0 ? form.speciality.join(", ") : "—"}
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
        <div className="license-details-section">
          <label>License Details</label>
          {form.licenseDetails?.length > 0 ? (
            <div className="license-table-wrapper">
              <table className="license-table">
                <thead>
                  <tr>
                    <th>State</th>
                    <th>License Number</th>
                    <th>Expiry Date</th>
                  </tr>
                </thead>
                <tbody>
                  {form.licenseDetails.map((lic, i) => (
                    <tr key={i}>
                      <td>{lic.state || "—"}</td>
                      <td>{lic.license_number || "—"}</td>
                      <td>{lic.expiry_date || "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            "—"
          )}
        </div>
        {/* <div className="provider-slots">
          <label>Availability</label>
          <AvailabilityCalendar />
        </div> */}
        <div className="about-doctor-section">
          <label>About Doctor</label>
          <p>{form.about || "—"}</p>
        </div>
      </div>
    </div>
  );
}
