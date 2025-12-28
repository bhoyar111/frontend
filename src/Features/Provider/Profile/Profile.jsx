import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import "./Profile.css";
import Service from "../Service/Services";
import showToast from "../../Common/Shared/Utils/ToastNotification";
import logo from "../../Common/Assests/logo.png";
// import AvailabilityCalendar from "../Availability/Calender/AvailabilityCalendar";
import FileControl from "../../Common/Shared/Components/FileControl/FileControl";

export default function Profile() {
  const location = useLocation();
  const userIdFromRoute = location.state?.userId;
  const loggedInUserId = useSelector((state) => state.auth.user.userData?._id);
  const userId = userIdFromRoute || loggedInUserId;

  const navigate = useNavigate();

  const [form, setForm] = useState(null);
  const [previewImage, setPreviewImage] = useState(logo);

  useEffect(() => {
    if (userId) fetchUserData(userId);
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
          profile_pic: null, // can't populate file input
          availableSlot: user.availableSlot,
          licenseDetails: user.licenseDetails?.length
            ? user.licenseDetails.map((lic) => ({
                state: lic.state || "",
                license_number: lic.license_number || "",
                expiry_date: lic.expiry_date?.includes("T")
                  ? lic.expiry_date.split("T")[0]
                  : lic.expiry_date || "",
              }))
            : [{ state: "", license_number: "", expiry_date: "" }],
        });

        if (user.profile_pic !== null) {
          previewImageFile(user?.profile_pic);
        }
      }
    } catch (err) {
      showToast(
        "error",
        err?.response?.data?.message || "Something went wrong"
      );
    }
  };

  const previewImageFile = async (file) => {
    const filePath = await FileControl.previewFile(file);
    if(filePath){
      setPreviewImage(filePath); // update preview
    }
  };

  if (!form) return <div className="profile-wrapper">Loadings...</div>;

  return (
    <div className="profile-wrapper-test">
      <div className="profile-header">
        <div className="profile-left">
          <div className="profile-image-wrapper">
            {previewImage ? (
              <img src={previewImage} alt="Preview" className="preview-image" />
            ) : (
              <div className="profile-image-placeholder">👨‍⚕️</div>
            )}
          </div>
          <div>
            <h2 className="profile-name">
              Dr. {form.firstName} {form.lastName}
            </h2>
            <p className="profile-email">{form.email}</p>
          </div>
        </div>
        <button
          className="edit-profile-btn"
          onClick={() => navigate(`/provider-Edit/${userId}`)}
        >
          Edit Profile
        </button>
      </div>
      <div className="profile-details">
        <div className="profile-details-grid">
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
