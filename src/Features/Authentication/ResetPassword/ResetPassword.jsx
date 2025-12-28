import React, { useEffect, useState } from "react";
import Service from "./Service";
import { useLocation, useNavigate } from "react-router-dom";
import showToast from "../../Common/Shared/Utils/ToastNotification";
import DynamicForm from "../../Common/Shared/Components/Form/DynamicForm";

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [token, setToken] = useState("");

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const tokenFromURL = queryParams.get("token");
    setToken(tokenFromURL);
  }, [location.search]);
  const fields = [
    {
      name: "password",
      label: "Password",
      type: "password",
      required: true,
      placeholder: "Enter password"
    },
    {
      name: "confirmPassword",
      label: "Confirm Password",
      type: "password",
      required: true,
      placeholder: "Re-enter Password"
    }
  ];

  const buttons = [{ label: "Submit", type: "submit" }];

  const handleSubmit = async (data) => {
    try {
      let reqData = {
        token: token,
        password: data?.password,
        confirmPassword: data?.confirmPassword
      };
      const response = await Service.resetPassword(reqData);
      if (response?.status === 200) {
        if (response?.data?.role === "ADMIN") {
          navigate("/admin-login");
        } else {
          navigate("/");
        }
        showToast("success", response?.message);
      } else {
        showToast("error", response?.message);
      }
    } catch (err) {
      showToast("error", err?.response?.message || "Failed to resend OTP");
    }
  };

  return (
    <div className="form-wrapper">
      <div className="form-container">
        <h2 className="form-title">Reset Password Form</h2>
        <DynamicForm
          fields={fields}
          onSubmit={handleSubmit}
          buttons={buttons}
        />
      </div>
    </div>
  );
};

export default ResetPassword;
