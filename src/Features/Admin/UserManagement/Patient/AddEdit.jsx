import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

import "./Patient.css";
import Service from "../Services";
import showToast from "../../../Common/Shared/Utils/ToastNotification";

export default function AddEdit() {
  // Get userId from URL params (used in edit mode)
  const { userId } = useParams();
  const navigate = useNavigate();

  // Initial form state
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    fullName: "",
    email: "",
    mobile: "",
    address: "",
    gender: "",
    dob: "",
    role: "Patient",
    profile_pic: null
  });

  const [errors, setErrors] = useState({});
  const [previewImage, setPreviewImage] = useState(null);

  // Fetch user data if editing
  useEffect(() => {
    if (userId) fetchUserData(userId);
  }, [userId]);

  // Fetch Patient data by userId
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

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "mobile") {
      // Allow only digits
      const onlyDigits = value.replace(/\D/g, "");
      setForm((prev) => ({ ...prev, [name]: onlyDigits }));
    } else if (name === "firstName" || name === "lastName") {
      setForm((prev) => {
        const updated = {
          ...prev,
          [name]: value
        };
        updated.fullName =
          `${name === "firstName" ? value : prev.firstName} ${name === "lastName" ? value : prev.lastName}`.trim();
        return updated;
      });
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Form validation
  const validate = () => {
    const errs = {};
    if (!form.firstName) errs.firstName = "First Name is required";
    if (!form.lastName) errs.lastName = "Last Name is required";
    if (!form.email) errs.email = "Email is required";
    if (!form.mobile) {
      errs.mobile = "Mobile number is required";
    } else if (!/^\d{10}$/.test(form.mobile)) {
      errs.mobile = "Mobile number must be exactly 10 digits";
    }
    if (!form.gender) errs.gender = "Gender is required";
    if (!form.dob) errs.dob = "Date of Birth is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Handle form submit (Add/Edit)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      ...form,
      ...(userId && { userId })
    };

    try {
      const response = await Service.addEditProvider(payload); // sending JSON
      if (response?.status === 200) {
        showToast("success", response?.message || "Patient saved");
        navigate("/patients", { state: { refresh: true } });
      } else {
        showToast("error", response?.message || "Save failed");
      }
    } catch (err) {
      showToast(
        "error",
        err?.response?.data?.message || "Something went wrong"
      );
    }
  };

  // Reset form values
  const handleReset = () => {
    setForm({
      firstName: "",
      lastName: "",
      fullName: "",
      email: "",
      mobile: "",
      address: "",
      gender: "",
      dob: "",
      role: "Patient",
      profile_pic: null
    });
    setErrors({});
    setPreviewImage(null);
  };

  return (
    <div className="main-form">
      <div className="form-header">
        <h5>{userId ? "Edit Patient" : "Add Patient"}</h5>
        <button onClick={() => navigate("/patients")} className="back-button">
          <FaArrowLeft style={{ marginRight: "5px", fontSize: "16px" }} />
          Back
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-row mb-3">
          <div className="profile-image-wrapper">
            <input type="file" accept="image/*" id="profilePicInput" hidden />
            <label htmlFor="profilePicInput" className="profile-image-label">
            {previewImage ? (
                <img
                src={previewImage}
                alt="Preview"
                className="profile-image"
                />
            ) : (
                <div className="profile-image-placeholder">
                <span className="plus-icon">+</span>
                <div className="upload-overlay">Profile</div>
                </div>
            )}
            </label>
        </div>
        </div>
        <div className="form-row mb-3">
          <div className="form-group">
            <label>
              First Name<span className="required">*</span>
            </label>
            <input
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
            />
            {errors.firstName && (
              <span className="error">{errors.firstName}</span>
            )}
          </div>
          <div className="form-group">
            <label>
              Last Name<span className="required">*</span>
            </label>
            <input
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
            />
            {errors.lastName && (
              <span className="error">{errors.lastName}</span>
            )}
          </div>
          <div className="form-group">
            <label>
              Email<span className="required">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
            />
            {errors.email && <span className="error">{errors.email}</span>}
          </div>
        </div>
        <div className="form-row mb-3">
          <div className="form-group">
            <label>
              Mobile Number<span className="required">*</span>
            </label>
            <input
              name="mobile"
              maxLength={10}
              pattern="\d*"
              value={form.mobile}
              onChange={handleChange}
            />
            {errors.mobile && <span className="error">{errors.mobile}</span>}
          </div>
          <div className="form-group">
            <label>Address</label>
            <input
              name="address"
              value={form.address}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>
              Gender<span className="required">*</span>
            </label>
            <select name="gender" value={form.gender} onChange={handleChange}>
              <option value="">Select</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Others">Others</option>
            </select>
            {errors.gender && <span className="error">{errors.gender}</span>}
          </div>
        </div>
        <div className="form-row mb-3">
          <div className="form-group">
            <label>
              Date of Birth<span className="required">*</span>
            </label>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Date of Birth"
                value={form.dob ? dayjs(form.dob) : null}
                onChange={(date) => {
                  const formattedDate = date ? date.format("YYYY-MM-DD") : "";
                  setForm((prev) => ({ ...prev, dob: formattedDate }));
                }}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    error: !!errors.dob,
                    helperText: errors.dob || "",
                    size: "small"
                  }
                }}
              />
            </LocalizationProvider>
          </div>
          <div className="form-group"></div>
          <div className="form-group"></div>
        </div>

        <div className="form-actions">
          <button type="button" className="cancel-btn" onClick={handleReset}>
            Reset
          </button>
          <button type="submit" className="save-btn">
            Save
          </button>
        </div>
      </form>
    </div>
  );
}
