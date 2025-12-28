import { axiosInstance } from "../../../Interceptors/axiosInterceptor";
import ApiUrlConstant from "../../Common/Shared/Utils/UrlConstants";

const Service = {
  login: (data) => {
    return axiosInstance.post(ApiUrlConstant.loginService(), data);
  },
  otpSendonMail: (data) => {
    return axiosInstance.post(ApiUrlConstant.optSendService(), data);
  },
  logInLogs: (data) => {
    return axiosInstance.post(ApiUrlConstant.loginLogsService(), data);
  }
};

export default Service;
