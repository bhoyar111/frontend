import { axiosInstance } from "../../../Interceptors/axiosInterceptor";
import ApiUrlConstant from "../../Common/Shared/Utils/UrlConstants";

const Service = {
  addUpdatePlan: (data) => {
    return axiosInstance.post(ApiUrlConstant.addUpdatePlanService(), data);
  },
  getAllPlanList: (data) => {
    return axiosInstance.get(ApiUrlConstant.listAllPlansService(), {
      params: data
    });
  },
  managePlan: (data) => {
    return axiosInstance.put(ApiUrlConstant.managePlanService(), data);
  },
  getByIdPlan: (data) => {
    return axiosInstance.get(ApiUrlConstant.getIdByPlanService(),{
       params: data
    } );
  }
};

export default Service;
