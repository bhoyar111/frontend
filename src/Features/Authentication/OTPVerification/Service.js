import { axiosInstance } from "../../../Interceptors/axiosInterceptor";
import ApiUrlConstant from "../../Common/Shared/Utils/UrlConstants";

const Service = {
  verifyOtp: (reqData) => {
    return axiosInstance.post(ApiUrlConstant.verifyOtpService(), reqData);
  },
  otpSendonMail: (data) => {
    return axiosInstance.post(ApiUrlConstant.optSendService(), data);
  },
  logInLogs: (data) => {
    return axiosInstance.post(ApiUrlConstant.loginLogsService(), data);
  }
};

export default Service;
