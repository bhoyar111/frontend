import { axiosInstance } from "../../../Interceptors/axiosInterceptor";
import ApiUrlConstant from "../../Common/Shared/Utils/UrlConstants";

const Service = {
  logOutLogs: (data) => {
    return axiosInstance.post(ApiUrlConstant.forgotPassewordService(), data);
  },
  providerDashboardCountViews: () => {
    return axiosInstance.get(ApiUrlConstant.providerCountDetails());
  },
};

export default Service;
