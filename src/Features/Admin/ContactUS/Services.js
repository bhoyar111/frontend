import { axiosInstance } from "../../../Interceptors/axiosInterceptor";
import ApiUrlConstant from "../../Common/Shared/Utils/UrlConstants";

const Service = {
  getUserContactUs: (data) => {
    return axiosInstance.get(ApiUrlConstant.userContactUsListService(), {
      params: data,
    });
  },
};

export default Service;
