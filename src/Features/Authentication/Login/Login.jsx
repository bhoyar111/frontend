import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Service from "./Service";
import "./Login.css";
import { useDispatch, useSelector } from "react-redux";
import { userlogin } from "../../Common/Shared/Slice/AuthSlice";
import showToast from "../../Common/Shared/Utils/ToastNotification";
import { loginLogs } from "../../Common/Shared/Slice/LogsSlice";
import DynamicForm from "../../Common/Shared/Components/Form/DynamicForm";
import { requestPermission } from "../../Notification/Firebase/firebase";


const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const heading = useSelector((state) => state.page.heading);
  const fields = [
    {
      name: "email",
      label: "Email",
      type: "email",
      required: true,
      placeholder: "Enter email"
    },
    {
      name: "password",
      label: "Password",
      type: "password",
      required: true,
      placeholder: "Enter password"
    }
  ];

  const buttons = [{ label: "Sign-In", type: "submit" }];

  const handleSubmit = async (data) => {
    let userRole;
    if (heading !== "Admin Login Form") {
      userRole = "Provider";
    }else{
      userRole = 'Admin';
    }
    try {
      let fcMToken = ""
      fcMToken = await requestPermission();
      let reqData = {
        role: userRole,
        email: data?.email,
        password: data?.password,
        fcmToken: fcMToken
      };
      const response = await Service.login(reqData);
      if (response?.status === 200) {
        if (response?.data?.userData?.verified === true) {
          if(userRole === 'Provider'){
            navigate("/provider-dashboard");
          }else{
            navigate("/admin-dashboard");
          }
          dispatch(userlogin(response?.data));
          saveLoginLogs(response?.data?.userData);
        } else {
          let data = { email: response?.data?.userData?.email };
          sendOtpOnMail(data);
        }
        showToast("success", response?.message);
      } else {
        showToast("error", response?.message);
      }
    } catch (err) {
      showToast("error", err?.response?.message);
    }
  };

  const sendOtpOnMail = async (data) => {
    try {
      const response = await Service.otpSendonMail(data);
      if (response?.status === 200) {
        let userData = {
          email: response?.data?.email,
          userId: response?.data?.userId
        };
        sessionStorage.setItem(
          "verification_details",
          JSON.stringify(userData)
        );
        navigate("/otp-verification");
        showToast("success", response?.message);
      } else {
        showToast("error", response?.message);
      }
    } catch (err) {
      showToast("error", err?.response?.message);
    }
  };

  const saveLoginLogs = async (data) => {
    try {
      let reqData = {
        user :{
          userId: data._id,
          fullName: data.fullName,
          role: data.role,
          email: data.email
        },
        action:"Login"
      };
      const response = await Service.logInLogs(reqData);
      if (response?.status === 200) {
        dispatch(loginLogs(response?.data));
      }
    } catch (err) {
      showToast("error", err?.response?.message);
    }
  };

  return (
    <div className="form-wrapper">
    <div className="form-container">
      <h2 className="form-title">{heading}</h2>
      <DynamicForm fields={fields} onSubmit={handleSubmit} buttons={buttons} />
      <div className="form-footer">
        <Link to="/forgot-password"> Forgot Password? </Link>
      </div>
      </div>
    </div>
  );
};

export default Login;
