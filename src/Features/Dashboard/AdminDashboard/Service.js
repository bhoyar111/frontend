import { axiosInstance } from "../../../Interceptors/axiosInterceptor";
import ApiUrlConstant from "../../Common/Shared/Utils/UrlConstants";

const Service = {
  logOutLogs: (data) => {
    return axiosInstance.post(ApiUrlConstant.forgotPassewordService(), data);
  },

  //Traction Dashboard
  userCountViews: () => {
    return axiosInstance.get(ApiUrlConstant.userCountDetails());
  },
  userAnalyticsViews: () => {
    return axiosInstance.get(ApiUrlConstant.userAnalyticsCDetails());
  },
  monthlyRetentionRate: () => {
    return axiosInstance.get(ApiUrlConstant.userMonthlyRetentionRate());
  },
  userBookingConsultRate: () => {
    return axiosInstance.get(ApiUrlConstant.userConsultBookRate());
  },

  //Content Dashboard
  mostViewArticleService: (data) => {
    return axiosInstance.get(ApiUrlConstant.mostViewArticleCount(), { params: data });
  },
  mostLikeArticleService: (data) => {
    return axiosInstance.get(ApiUrlConstant.mostLikeArticle(), { params: data });
  },
  mostDisLikeArticleService: (data) => {
    return axiosInstance.get(ApiUrlConstant.mostDisLikeArticle(), { params: data });
  },
  mostSavedArticleService: (data) => {
    return axiosInstance.get(ApiUrlConstant.mostSavedArticle(), { params: data });
  },
  mostSearchArticleService: (data) => {
    return axiosInstance.get(ApiUrlConstant.mostSearchArticle(), { params: data });
  },
  zeroSearchArticleService: (data) => {
    return axiosInstance.get(ApiUrlConstant.zeroSearchArticle(), { params: data });
  },
  mostSaveQuesService: (data) => {
    return axiosInstance.get(ApiUrlConstant.mostSaveQuestions(), { params: data });
  },

  //Consult Dashboard
  userConsultBookingService: () => {
    return axiosInstance.get(ApiUrlConstant.userConsultBooking());
  },
  adminAppointmentDetailService: () => {
    return axiosInstance.get(ApiUrlConstant.adminAppointmentDetails());
  },
  firstRepeatConsultDetailService: () => {
    return axiosInstance.get(ApiUrlConstant.firstRepeatConsultDetail());
  },
};

export default Service;
