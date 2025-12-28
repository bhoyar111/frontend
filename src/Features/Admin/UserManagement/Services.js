import { axiosInstance } from "../../../Interceptors/axiosInterceptor";
import ApiUrlConstant from "../../Common/Shared/Utils/UrlConstants";

const Service = {
  getListProviders: (data) => {
    return axiosInstance.get(ApiUrlConstant.providerListService(), {
      params: data
    });
  },
   getPatientSurveyList: (data) => {
    return axiosInstance.get(ApiUrlConstant.patientSurveyListService(), {
      params: data
    });
  },
  addEditProvider: (data) => {
    return axiosInstance.post(ApiUrlConstant.addEditProviderService(), data);
  },
  getByIdProvider: (data) => {
     return axiosInstance.get(ApiUrlConstant.getByIdProviderService(), {
      params: data
    });
  },
  getProviderSlots: (data) => {
    return axiosInstance.get(ApiUrlConstant.providerSlotListService(), {
      params: data
    });
  },
  deleteProvider: (data) => {
    return axiosInstance.put(ApiUrlConstant.deleteProviderService(), data);
  },
  patientInvitation: (data) => {
    return axiosInstance.post(ApiUrlConstant.patientInvitationService(), data);
  },
  getListSpeciality: (data) => {
    return axiosInstance.get(ApiUrlConstant.specialityListService(), {
      params: data
    });
  },
  getListState: (data) => {
    return axiosInstance.get(ApiUrlConstant.stateListService(), {
      params: data
    });
  },
  getViewSurveyDetails: (data) => {
     return axiosInstance.get(ApiUrlConstant.getSurveyDetailsService(), {
      params: data
    });
  },
};

export default Service;
