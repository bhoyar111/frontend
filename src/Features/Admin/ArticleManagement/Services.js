import { axiosInstance } from "../../../Interceptors/axiosInterceptor";
import ApiUrlConstant from "../../Common/Shared/Utils/UrlConstants";

const Service = {
  getListCategories: (data) => {
    return axiosInstance.get(ApiUrlConstant.categoryListService(), {
      params: data,
    });
  },
  getListSubCategories: (data) => {
    return axiosInstance.get(ApiUrlConstant.subCategoryListService(), {
      params: data,
    });
  },
  addCategory: (data) => {
    return axiosInstance.post(ApiUrlConstant.addCategoryService(), data);
  },
  editCategory: (data) => {
    return axiosInstance.post(ApiUrlConstant.editCategoryService(), data);
  },
  deleteCategory: (data) => {
    return axiosInstance.delete(ApiUrlConstant.deleteCategoryService(data), "");
  },
  getByIdProvider: (data) => {
    return axiosInstance.get(ApiUrlConstant.getByIdCategoryService(), {
      params: data,
    });
  },
  getByIdCategory: (data) => {
    return axiosInstance.get(ApiUrlConstant.getByIdCategoryService(data), "");
  },
  // SubCategory
  addSubCategory: (data) => {
    return axiosInstance.post(ApiUrlConstant.addSubCategoryService(), data);
  },
  editSubCategory: (data) => {
    return axiosInstance.post(ApiUrlConstant.editSubCategoryService(), data);
  },
  deleteSubCategory: (data) => {
    return axiosInstance.delete(
      ApiUrlConstant.deleteSubCategoryService(data),
      ""
    );
  },
  getByIdSubCategory: (data) => {
    console.log("data ", data);
    return axiosInstance.get(
      ApiUrlConstant.getByIdSubCategoryService(data),
      ""
    );
  },
  getListArticles: (data) => {
    return axiosInstance.get(ApiUrlConstant.subArticleListService(), {
      params: data,
    });
  },
  addArticle: (data, config = {}) => {
    return axiosInstance.post(ApiUrlConstant.addArticleService(), data, config);
  },
  editArticle: (articleId, data, config = {}) => {
    return axiosInstance.post(
      ApiUrlConstant.editArticleService(articleId),
      data,
      config
    );
  },
  deleteArticle: (data) => {
    return axiosInstance.delete(ApiUrlConstant.deleteArticleService(data), "");
  },
  getByIdArticle: (data) => {
    return axiosInstance.get(ApiUrlConstant.getByIdArticleService(data), "");
  },

  // getProviderSlots: (data) => {
  //   return axiosInstance.get(ApiUrlConstant.providerSlotListService(), {
  //     params: data
  //   });
  // },

  // patientInvitation: (data) => {
  //   return axiosInstance.post(ApiUrlConstant.patientInvitationService(), data);
  // },
  // getListSpeciality: (data) => {
  //   return axiosInstance.get(ApiUrlConstant.specialityListService(), {
  //     params: data
  //   });
  // },
  // getListState: (data) => {
  //   return axiosInstance.get(ApiUrlConstant.stateListService(), {
  //     params: data
  //   });
  // }
};

export default Service;
