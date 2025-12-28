import { axiosInstance } from "../../../Interceptors/axiosInterceptor";
import ApiUrlConstant from "../../Common/Shared/Utils/UrlConstants";

const Service = {
  allTransactionsList: (data) => {
    return axiosInstance.get(ApiUrlConstant.getAllPaymentHistory(), {
      params: data
    });
  }
};

export default Service;
