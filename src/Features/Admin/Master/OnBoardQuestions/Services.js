import { axiosInstance } from "../../../../Interceptors/axiosInterceptor";
import ApiUrlConstant from "../../../Common/Shared/Utils/UrlConstants";


const Service = {
  addNewQuestions: (data) => {
    return axiosInstance.post(ApiUrlConstant.addOnBoardQuestionService(), data);
  },
  updateQuestions: (data) => {
    return axiosInstance.put(ApiUrlConstant.updateOnBoardQuestionsService(), data);
  },
  getListQuestions: (data) => {
    return axiosInstance.get(ApiUrlConstant.OnBoardquestionListService(), {
      params: data
    });
  },
  deleteUpdateQuestions: (data) => {
    return axiosInstance.put(ApiUrlConstant.updateOnBoardQuestionStatusService(), data);
  },
  getByIdQuestions: (data) => {
    return axiosInstance.get(ApiUrlConstant.getOnBoardQuestionDetailsService(),{
      params: data
    } );
  }
};

export default Service;
