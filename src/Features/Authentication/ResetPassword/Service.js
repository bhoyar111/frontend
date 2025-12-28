import { axiosInstance } from "../../../Interceptors/axiosInterceptor";
import ApiUrlConstant from "../../Common/Shared/Utils/UrlConstants";

const Service = {
  resetPassword: (reqData) => {
    return axiosInstance.post(ApiUrlConstant.resetPasswordService(), reqData);
  }
};

export default Service;
