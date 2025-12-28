import showToast from "../../Utils/ToastNotification";
import Service from "./Servcie";

const FileControl = {
  uploadFile: async (data) => {
    const formData = new FormData();
    formData.append("userId", data?.userId); // comes from useParams
    formData.append("docType", data?.docType);
    formData.append("files", data?.files);

    try {
      const response = await Service.uploadFile(formData);
      if (response?.status === 200) {
        const filePath = response?.data?.data?.[0]; // backend should return array of paths
        showToast("success", response?.message || "Profile picture uploaded");
        return filePath; // return file path
      } else {
        showToast("error", response?.message || "Upload failed");
        return null;
      }
    } catch (err) {
      showToast(
        "error",
        err?.response?.data?.message || "Something went wrong while uploading"
      );
      return null;
    }
  },

  previewFile: async (file) => {
    if(!file){
      return;
    }
    let reqData = {
      path: file
    };
    try {
      const response = await Service.getFileUrl(reqData);
      if (response?.status === 200) {
        const filePath = response?.data?.data; // adjust key based on backend response
        return filePath; // update preview
      } else {
        showToast("error", response?.message || "Preview File failed");
        return null;
      }
    } catch (err) {
      showToast(
        "error",
        err?.response?.data?.message || "Something went wrong while uploading"
      );
    }
  }
};
export default FileControl;
