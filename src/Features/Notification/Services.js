import { axiosInstance } from "../../Interceptors/axiosInterceptor";
import ApiUrlConstant from "../Common/Shared/Utils/UrlConstants";

const Service = {
  allUserNotiList: (data) => {
    return axiosInstance.get(ApiUrlConstant.listAllNotification(), {
      params: data
    });
  },
  markNotificationRead: (data) => {
    return axiosInstance.put(ApiUrlConstant.markNotificationAsRead(), data);
  },
  unReadNotiCount: (data) => {
    return axiosInstance.get(ApiUrlConstant.allUnreadNotiCount(), {
      params: data
    });
  },
  markAllRead: (data) => {
    return axiosInstance.put(ApiUrlConstant.markAllNotiAsRead(), data);
  }
};

export default Service;
