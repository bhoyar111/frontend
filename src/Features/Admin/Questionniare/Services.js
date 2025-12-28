import { axiosInstance } from "../../../Interceptors/axiosInterceptor";
import ApiUrlConstant from "../../Common/Shared/Utils/UrlConstants";

const Service = {
  addNewQuestions: (data) => {
    return axiosInstance.post(ApiUrlConstant.addQuestionService(), data);
  },
  updateQuestions: (data) => {
    return axiosInstance.put(ApiUrlConstant.updateQuestionsService(), data);
  },
  getListQuestions: (data) => {
    return axiosInstance.get(ApiUrlConstant.questionListService(), {
      params: data
    });
  },
  deleteUpdateQuestions: (data) => {
    return axiosInstance.put(ApiUrlConstant.updateQuestionStatusService(), data);
  },
  getByIdQuestions: (data) => {
    return axiosInstance.get(ApiUrlConstant.getQuestionDetailsService(),{
      params: data
    } );
  }
};

export default Service;
