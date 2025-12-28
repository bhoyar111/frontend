import { axiosInstance } from "../../../Interceptors/axiosInterceptor";
import ApiUrlConstant from "../../Common/Shared/Utils/UrlConstants";

const Service = {
  // Static Page methods (NEW)
  getStaticPages: (data) => {
    return axiosInstance.get(ApiUrlConstant.staticPageListService(), {
      params: data
    });
  },

  createStaticPage: (data) => {
    return axiosInstance.post(ApiUrlConstant.addStaticPageService(), data);
  },

  getStaticPageById: (id) => {
    return axiosInstance.get(ApiUrlConstant.getStaticPageByIdService(id));
  },

  getStaticPageBySlug: (slug) => {
    return axiosInstance.get(ApiUrlConstant.getStaticPageBySlugService(slug));
  },

  updateStaticPage: (id, data) => {
    return axiosInstance.put(ApiUrlConstant.updateStaticPageService(id), data);
  },

  deleteStaticPage: (id) => {
    return axiosInstance.delete(ApiUrlConstant.deleteStaticPageService(id));
  }
};

export default Service;