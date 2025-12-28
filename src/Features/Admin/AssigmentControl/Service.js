import { axiosInstance } from "../../../Interceptors/axiosInterceptor";
import ApiUrlConstant from "../../Common/Shared/Utils/UrlConstants";

const Service = {
  getListProviders: (data) => {
    return axiosInstance.get(ApiUrlConstant.providerListService(), {
      params: data
    });
  },
  allRequestList: (data) => {
    return axiosInstance.get(ApiUrlConstant.allAssigmentsList(), {
      params: data
    });
  },
  adminAssignExpert: (data) => {
    return axiosInstance.put(ApiUrlConstant.assignExpert(), data );
  },
  requestDetails: (data) => {
    return axiosInstance.get(ApiUrlConstant.detailsById(), {
      params: data
    });
  }

};

export default Service;
