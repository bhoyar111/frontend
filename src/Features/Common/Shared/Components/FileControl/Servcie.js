import { axiosInstance } from "../../../../../Interceptors/axiosInterceptor";
import ApiUrlConstant from "../../../../Common/Shared/Utils/UrlConstants";

const Service = {
  uploadFile: (data) => {
    return axiosInstance.post(ApiUrlConstant.uploadFileServcie(), data);
  },
  getFileUrl: (data) => {
    return axiosInstance.post(ApiUrlConstant.generateFileUrlServcie(), data, {
      loaderKey: false
    });
  }
};
export default Service;
