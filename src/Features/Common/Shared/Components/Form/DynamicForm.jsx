import React, { useRef, useState, forwardRef, useImperativeHandle } from "react";
import { validateForm } from "../../Utils/FormValidation";
import showToast from "../../Utils/ToastNotification";
import './form.css';

const DynamicForm = forwardRef(({ fields, onSubmit, buttons = [] }, ref) => {
  const [formData, setFormData] = useState(() =>
    fields.reduce((acc, field) => {
      if (field.type === "checkbox-group") acc[field.name] = [];
      else if (field.type === 'date-group') acc[field.name] = Array(field.count || 1).fill('');
      else if (field.type === "checkbox") acc[field.name] = false;
      else if (field.type === "otp") acc[field.name] = Array(field.length || 4).fill("");
      else acc[field.name] = "";
      return acc;
    }, {})
  );
  const [errors, setErrors] = useState({});
  const otpRefs = useRef([]);

  // Expose reset method to parent
  useImperativeHandle(ref, () => ({
    resetForm: () => {
      const emptyData = fields.reduce((acc, field) => {
        if (field.type === "checkbox-group") acc[field.name] = [];
        else if (field.type === 'date-group') acc[field.name] = Array(field.count || 1).fill('');
        else if (field.type === "checkbox") acc[field.name] = false;
        else if (field.type === "otp") acc[field.name] = Array(field.length || 4).fill("");
        else acc[field.name] = "";
        return acc;
      }, {});
      setFormData(emptyData);
      setErrors({});
    }
  }));

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateForm(fields, formData);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length === 0) {
      const formattedData = { ...formData };
      // Convert OTP arrays to strings
      fields.forEach((field) => {
        if (field.type === "otp" && Array.isArray(formattedData[field.name])) {
          formattedData[field.name] = formattedData[field.name].join("");
        }
      });
      onSubmit(formattedData);
    } else {
      showToast("Invalid form. Please fix errors.");
    }
  };

  const handleOtpChange = (e, idx, field) => {
    const value = e.target.value.replace(/\D/g, ""); // allow only digits
    const updated = [...(formData[field.name] || Array(field.length).fill(""))];
    updated[idx] = value;
    setFormData((prev) => ({ ...prev, [field.name]: updated }));
    if (value && idx < field.length - 1) {
      otpRefs.current[idx + 1]?.focus();
    }
  };
  const handleOtpKeyDown = (e, idx, field) => {
    if (e.key === "Backspace" && !formData[field.name][idx] && idx > 0) {
      otpRefs.current[idx - 1]?.focus();
    }
  };

  const [showPassword, setShowPassword] = useState({});

  const togglePasswordVisibility = (name) => {
  setShowPassword((prev) => ({ ...prev, [name]: !prev[name] }));
};

  const renderField = (field) => {
    const error = errors[field.name];

    switch (field.type) {
      case "textarea":
        return (
          <>
            <textarea
              className="form-input"
              name={field.name}
              placeholder={field.placeholder}
              value={formData[field.name]}
              onChange={(e) => handleChange(e, field)}
            />
            {error && <div className="form-error">{error}</div>}
          </>
        );

      case "select":
        return (
          <>
            <select
              className="form-input"
              name={field.name}
              value={formData[field.name]}
              onChange={(e) => handleChange(e, field)}
            >
              <option value="">Select {field.label || field.name}</option>
              {field.options?.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            {error && <div className="form-error">{error}</div>}
          </>
        );

      case "radio":
        return (
          <>
            <div>
              {field.options?.map((opt) => (
                <label key={opt.value} className="form-label">
                  <input
                    type="radio"
                    name={field.name}
                    value={opt.value}
                    checked={formData[field.name] === opt.value}
                    onChange={(e) => handleChange(e, field)}
                  />
                  {opt.label}
                </label>
              ))}
            </div>
            {error && <div className="form-error">{error}</div>}
          </>
        );

      case "checkbox-group":
        return (
          <>
            <div>
              {field.options?.map((opt) => (
                <label key={opt.value} className="form-label">
                  <input
                    type="checkbox"
                    name={field.name}
                    value={opt.value}
                    checked={formData[field.name].includes(opt.value)}
                    onChange={(e) => handleChange(e, field)}
                  />
                  {opt.label}
                </label>
              ))}
            </div>
            {error && <div className="form-error">{error}</div>}
          </>
        );

      case "checkbox":
        return (
          <>
            <label className="form-label">
              <input
                type="checkbox"
                name={field.name}
                checked={formData[field.name]}
                onChange={(e) => handleChange(e, field)}
              />
              {field.label}
            </label>
            {error && <div className="form-error">{error}</div>}
          </>
        );

      case "date":
        return (
          <>
            <input
              type="date"
              className="form-input"
              name={field.name}
              value={formData[field.name]}
              onChange={(e) => handleChange(e, field)}
              onBlur={() => handleBlur(field)}
            />
            {error && <div className="form-error">{error}</div>}
          </>
        );

      case "date-group":
        return (
          <>
            {(formData[field.name] || []).map((val, idx) => (
              <input
                key={idx}
                type="date"
                className="form-input mb-2"
                value={val}
                onChange={(e) => {
                  const updated = [...formData[field.name]];
                  updated[idx] = e.target.value;
                  setFormData((prev) => ({ ...prev, [field.name]: updated }));
                }}
                onBlur={() => {
                  const validationErrors = validateForm([field], formData);
                  setErrors((prev) => ({ ...prev, ...validationErrors }));
                }}
              />
            ))}
            {error && <div className="form-error">{error}</div>}
          </>
        );
      case "otp":
        return (
          <>
            <div className="otp-input-wrapper">
              {Array.from({ length: field.length || 4 }).map((_, idx) => (
                <input
                  key={idx}
                  type="text"
                  maxLength={1}
                  className="otp-input"
                  value={formData[field.name][idx] || ""}
                  onChange={(e) => handleOtpChange(e, idx, field)}
                  onKeyDown={(e) => handleOtpKeyDown(e, idx, field)}
                  ref={(el) => (otpRefs.current[idx] = el)}
                />
              ))}
            </div>
            {errors[field.name] && (
              <div className="form-error">{errors[field.name]}</div>
            )}
          </>
        );

        default:
          return (
            <>
              <div className="password-input-wrapper">
                <input
                  type={field.type === "password" && showPassword[field.name] ? "text" : field.type}
                  className="form-input"
                  name={field.name}
                  placeholder={field.placeholder}
                  value={formData[field.name]}
                  onChange={(e) => handleChange(e, field)}
                  onBlur={() => handleBlur(field)}
                  autoComplete={
                    field.name === "password" ? "current-password" :
                    field.name === "newPassword" || field.name === "confirmPassword" ? "new-password" :
                    "off"
                  }
                />
                {field.type === "password" && (
                  <span
                    className="toggle-password-icon"
                    onClick={() => togglePasswordVisibility(field.name)}
                    style={{ cursor: "pointer", marginLeft: "-30px" }}
                  >
                    {showPassword[field.name] ? (
                      <i className="fas fa-eye-slash" />
                    ) : (
                      <i className="fas fa-eye" />
                    )}
                  </span>
                )}
              </div>
              {error && <div className="form-error">{error}</div>}
            </>
          );
    }
  };

  const handleBlur = (field) => {
    const validationErrors = validateForm([field], formData);
    setErrors((prev) => ({ ...prev, ...validationErrors }));
  };

  const handleChange = (e, field) => {
    const { name, value, checked, type } = e.target;
    let updatedFormData;
    if (field.type === "checkbox-group") {
      updatedFormData = {
        ...formData,
        [name]: checked
          ? [...formData[name], value]
          : formData[name].filter((v) => v !== value)
      };
    } else if (type === "checkbox") {
      updatedFormData = { ...formData, [name]: checked };
    } else {
      updatedFormData = { ...formData, [name]: value };
    }
    setFormData(updatedFormData);
    // Validate the updated formData for that field
    const fieldError = validateForm([field], updatedFormData);
    setErrors((prevErrors) => {
      const updatedErrors = { ...prevErrors };
      if (fieldError[field.name]) {
        // If still invalid, set error
        updatedErrors[field.name] = fieldError[field.name];
      } else {
        // If valid, remove error
        delete updatedErrors[field.name];
      }
      return updatedErrors;
    });
  };
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {fields.map((field) => (
        <div key={field.name}>
          {field.type !== "checkbox" &&
            field.type !== "checkbox-group" &&
            field.type !== "radio" && (
              <label className="form-label">{field.label}</label>
            )}
          {renderField(field)}
        </div>
      ))}
      <div className="flex gap-4">
        {buttons.length > 0 ? (
          buttons.map((btn, idx) => (
            <button
              key={idx}
              type={btn.type || "button"}
              onClick={btn.type === "button" ? btn.onClick : undefined}
              className={`form-button ${btn.className || ""}`}
            >
              {btn.label}
            </button>
          ))
        ) : (
          <button type="submit" className="form-button">
            Submit
          </button>
        )}
      </div>
    </form>
  );
});

DynamicForm.displayName = "DynamicForm";

export default DynamicForm;

