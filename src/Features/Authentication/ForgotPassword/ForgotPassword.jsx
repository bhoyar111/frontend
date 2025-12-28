import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Service from "./Service";
import DynamicForm from "../../Common/Shared/Components/Form/DynamicForm";
import showToast from "../../Common/Shared/Utils/ToastNotification";
const ForgotPassword = () => {
  const navigate = useNavigate();
  const fields = [
    {
      name: "email",
      label: "Email",
      type: "email",
      required: true,
      placeholder: "Enter email"
    }
  ];

  const buttons = [{ label: "Submit", type: "submit" }];

  const handleSubmit = async (data) => {
    try {
      const response = await Service.forgotPassword(data);
      if (response?.status === 200) {
        showToast("success", response?.message);
        navigate("/");
      } else {
        showToast("error", response?.message);
      }
    } catch (err) {
      showToast("error", err?.response?.message);
    }
  };

  return (
    <div className="form-wrapper">
      <div className="form-container">
        <h2 className="form-title">Forgot Password Form</h2>
        <DynamicForm
          fields={fields}
          onSubmit={handleSubmit}
          buttons={buttons}
        />
        <div className="form-footer">
          <Link to="/">
            <i className="bi bi-arrow-left"></i> Back to Login{" "}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
