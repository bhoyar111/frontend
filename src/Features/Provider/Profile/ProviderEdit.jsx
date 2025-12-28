import React, { useEffect, useState } from "react";
import Select from "react-select";
import { useParams, useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

import "./Profile.css";
import Service from "../Service/Services";
import showToast from "../../Common/Shared/Utils/ToastNotification";
import FileControl from "../../Common/Shared/Components/FileControl/FileControl";
import logo from "../../Common/Assests/logo.png";

export default function ProviderEdit() {
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
    role: "Provider",
    speciality: [],
    experience: "",
    about: "",
    profile_pic: null,
    licenseDetails: [{ state: "", license_number: "", expiry_date: "" }],
  });

  const [states, setStates] = useState([]);
  const [specialities, setSpecialities] = useState([]);
  const [errors, setErrors] = useState({});
  const [previewImage, setPreviewImage] = useState(logo);

  // Fetch user data if editing
  useEffect(() => {
    if (userId) fetchUserData(userId);
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
        previewImageFile(user?.profile_pic);
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
          role: user.role || "Provider",
          speciality: user.speciality || "",
          experience: user.experience || "",
          about: user.about || "",
          // profile_pic: null, // can't populate file input
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
      }
    } catch (err) {
      showToast(
        "error",
        err?.response?.data?.message || "Failed to fetch user"
      );
    }
  };

  // Fetch user speciality
  const fetchSpecialityData = async () => {
    try {
      const response = await Service.getListSpeciality();
      if (response?.status === 200) {
        setSpecialities(response?.data?.result || []);
      }
    } catch (err) {
      showToast(
        "error",
        err?.response?.message || "Failed to fetch Speciality"
      );
    }
  };

  // Fetch user states
  const fetchStateData = async () => {
    try {
      const response = await Service.getListState();
      if (response?.status === 200) {
        setStates(response?.data?.result || []);
      }
    } catch (err) {
      showToast("error", err?.response?.message || "Failed to fetch State");
    }
  };

  // Handle License changes
  const handleLicenseChange = (index, field, value) => {
    const updated = [...form.licenseDetails];
    updated[index][field] = value;
    setForm((prev) => ({ ...prev, licenseDetails: updated }));
  };

  // Add License
  const addLicense = () => {
    setForm((prev) => ({
      ...prev,
      licenseDetails: [
        ...prev.licenseDetails,
        { state: "", license_number: "", expiry_date: "" },
      ],
    }));
  };

  // Remove License
  const removeLicense = (index) => {
    setForm((prev) => ({
      ...prev,
      licenseDetails: prev.licenseDetails.filter((_, i) => i !== index),
    }));
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "license_number" || name === "expiry_date") {
      setForm((prev) => ({
        ...prev,
        licenseDetails: {
          ...prev.licenseDetails,
          [name]: value,
        },
      }));
    } else if (name === "firstName" || name === "lastName") {
      setForm((prev) => {
        const updated = {
          ...prev,
          [name]: value,
        };
        updated.fullName =
          `${name === "firstName" ? value : prev.firstName} ${name === "lastName" ? value : prev.lastName}`.trim();
        return updated;
      });
    } else if (name === "mobile") {
      // Allow only digits
      const onlyDigits = value.replace(/\D/g, "");
      setForm((prev) => ({ ...prev, [name]: onlyDigits }));
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
    if (!form.speciality) errs.speciality = "Speciality is required";
    if (!form.experience) errs.experience = "Experience is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Handle form submit (Add/Edit)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      ...form,
      ...(userId && { userId }),
    };

    try {
      const response = await Service.addEditProvider(payload); // sending JSON
      if (response?.status === 200) {
        showToast("success", response?.message || "Provider saved");
        navigate("/provider-profile", { state: { refresh: true } });
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
      role: "Provider",
      speciality: [],
      experience: "",
      about: "",
      profile_pic: null,
      licenseDetails: [{ state: "", license_number: "", expiry_date: "" }],
    });
    setErrors({});
    setPreviewImage(null);
  };

  useEffect(() => {
    let mounted = true;
    if (mounted) {
      fetchSpecialityData();
      fetchStateData();
    }
    return () => {
      mounted = false;
    };
  }, []);

  const uploadProfilePicture = async (file) => {
    let reqData = {
      userId: userId,
      docType: "profile",
      files: file,
    };
    const response = await FileControl.uploadFile(reqData);
    if (response) {
      setForm((prev) => ({ ...prev, profile_pic: response }));
    }
  };
  const previewImageFile = async (file) => {
    const filePath = await FileControl.previewFile(file);
    if (filePath) {
      setPreviewImage(filePath); // update preview
    }
  };

  return (
    <>
      <div className="main-provider-Edit-form">
        <div className="form-header mb-2">
          <h5>Provider Edit</h5>
          <button
            onClick={() => navigate("/provider-profile")}
            className="back-button"
          >
            <FaArrowLeft style={{ marginRight: "5px", fontSize: "16px" }} />
            Back
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="profile-image-wrapper">
              <input
                type="file"
                accept="image/*"
                id="profilePicInput"
                hidden
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    setPreviewImage(URL.createObjectURL(file)); // show instant preview
                    uploadProfilePicture(file);
                  }
                }}
              />
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
                    <div className="upload-overlay">Profile Picture</div>
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
              <label>Date of Birth</label>
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
                      size: "small",
                    },
                  }}
                />
              </LocalizationProvider>
            </div>
            <div className="form-group">
              <label>
                Speciality<span className="required"></span>
              </label>
              <Select
                isMulti
                name="speciality"
                options={specialities.map((sp) => ({
                  value: sp.specialityName,
                  label: sp.specialityName,
                }))}
                className="basic-multi-select"
                classNamePrefix="select"
                value={form.speciality.map((s) => ({ value: s, label: s }))}
                onChange={(selectedOptions) => {
                  const selected = selectedOptions
                    ? selectedOptions.map((opt) => opt.value)
                    : [];
                  setForm((prev) => ({ ...prev, speciality: selected }));
                  if (errors.speciality && selected.length > 0) {
                    setErrors((prevErrors) => {
                      const newErrors = { ...prevErrors };
                      delete newErrors.speciality;
                      return newErrors;
                    });
                  }
                }}
              />
              {errors.speciality && (
                <span className="error">{errors.speciality}</span>
              )}
            </div>
            <div className="form-group">
              <label>
                Experience (years)<span className="required">*</span>
              </label>
              <input
                type="number"
                name="experience"
                value={form.experience}
                onChange={handleChange}
              />
              {errors.experience && (
                <span className="error">{errors.experience}</span>
              )}
            </div>
          </div>
          <div className="form-row mb-3">
            {form.licenseDetails.map((license, index) => (
              <div key={index} className="form-row license-row">
                <div className="form-group">
                  <label>
                    State<span className="required">*</span>
                  </label>
                  <Select
                    options={states.map((st) => ({
                      value: st.stateName,
                      label: st.stateName,
                    }))}
                    value={
                      license.state
                        ? { value: license.state, label: license.state }
                        : null
                    }
                    onChange={(selected) =>
                      handleLicenseChange(index, "state", selected?.value || "")
                    }
                    placeholder="Select or search state..."
                    isClearable
                  />
                </div>
                <div className="form-group">
                  <label>
                    License Number<span className="required">*</span>
                  </label>
                  <input
                    value={license.license_number}
                    onChange={(e) =>
                      handleLicenseChange(
                        index,
                        "license_number",
                        e.target.value
                      )
                    }
                  />
                </div>
                <div className="form-group">
                  <label>
                    Expiry Date<span className="required">*</span>
                  </label>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      value={
                        license.expiry_date ? dayjs(license.expiry_date) : null
                      }
                      onChange={(date) =>
                        handleLicenseChange(
                          index,
                          "expiry_date",
                          date ? date.format("YYYY-MM-DD") : ""
                        )
                      }
                      slotProps={{
                        textField: { size: "small", fullWidth: true },
                      }}
                    />
                  </LocalizationProvider>
                </div>
                <div className="add-remove-group-button">
                  {form.licenseDetails.length > 1 && (
                    <button
                      className="remove-btn"
                      type="button"
                      onClick={() => removeLicense(index)}
                    >
                      -
                    </button>
                  )}
                  {index === form.licenseDetails.length - 1 && (
                    <button
                      className="add-btn"
                      type="button"
                      onClick={addLicense}
                    >
                      +
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="form-row mb-3">
            <div className="form-group">
              <label>About</label>
              <textarea
                name="about"
                value={form.about}
                onChange={handleChange}
                rows={3}
              />
            </div>
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
    </>
  );
}
