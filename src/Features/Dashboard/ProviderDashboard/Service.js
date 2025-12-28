import { axiosInstance } from "../../../Interceptors/axiosInterceptor";
import ApiUrlConstant from "../../Common/Shared/Utils/UrlConstants";

const Service = {
  logOutLogs: (data) => {
    return axiosInstance.post(ApiUrlConstant.forgotPassewordService(), data);
  },
};

export default Service;
