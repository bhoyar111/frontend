import axios from "axios";
import { store } from "../Redux/Store";
import { apiUrl } from "../Config/Environment";
import showToast from "../Features/Common/Shared/Utils/ToastNotification";
import { hideLoader, showLoader } from "../Features/Common/Shared/Slice/LoaderSlice";
import { getFingerprint } from "../Utils/Fingerprint";
import { encryptData, decryptData, isCryptoEnabled } from "../Utils/CryptoUtils";
import { userlogout } from "../Features/Common/Shared/Slice/AuthSlice";

const axiosInstance = axios.create({ baseURL: apiUrl });

axiosInstance.interceptors.request.use(
  async (config) => {
    const state = store.getState();
    const authToken = state?.auth?.user?.token;

    if (authToken) {
      config.headers.Authorization = `Bearer ${authToken}`;
    }

    // Add device fingerprint
    const fingerprint = await getFingerprint();
    config.headers["uuid"] = fingerprint;

    const method = config.method?.toLowerCase();

     // Skip encryption for upload-documents endpoint
    if (config.url?.includes("/common-service/common/upload-documents")) {
      config.skipEncryption = true;
    }

    if (isCryptoEnabled() && !config.skipEncryption) {
      try {
        // Encrypt Body (for POST, PUT, PATCH)
        if (["post", "put", "patch"].includes(method) && config.data) {
          config.data = { encryptData: encryptData(config.data) };
        }

        // Encrypt Query Params (for GET, DELETE)
        if (config.params) {
          config.params = { encryptData: encryptData(config.params) };
        }

        // Encrypt URL Param
        if (config.url?.includes("/encryptData")) {
          const urlParts = config.url.split("/");
          const last = urlParts[urlParts.length - 1];
          if (last && !last.includes("=")) {
            const encryptedParam = encryptData({ param: last });
            config.url = config.url.replace(last, `encryptData=${encodeURIComponent(encryptedParam)}`);
          }
        }
      } catch (err) {
        throw new Error("Encryption failed: " + err.message);
      }
    }

    // Show loader
    if (config.loaderKey !== false) {
      store.dispatch(showLoader(config.loaderKey || true));
    }

    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => {
    if (response.config.loaderKey !== false) {
      store.dispatch(hideLoader(response.config.loaderKey || true));
    }

    // Decrypt response
    if (isCryptoEnabled() && response.data?.encryptData) {
      try {
        const decrypted = decryptData(response.data.encryptData);
        return decrypted;
      } catch (err) {
        throw new Error("Decryption failed: " + err.message);
      }
    }

    return response.data;
  },
  (error) => {
    const { response } = error;

    // Hide loader
    if (error.config?.loaderKey !== false) {
      store.dispatch(hideLoader(error.config.loaderKey || true));
    }

    // Decrypt error response
    if (isCryptoEnabled() && response?.data?.encryptData) {
      try {
        const decrypted = decryptData(response.data.encryptData);
        response.data = decrypted;
      } catch (err) {
        throw new Error("Failed to decrypt error response: " + err.message);
      }
    }

    // Auto logout on token expiry
    if (response?.status === 401 && response?.data?.message === "Unauthorized") {
      showToast("error", "Session expired. Logging out...");
      store.dispatch(userlogout()); // ⬅️ Dispatch logout action
      // Optional: clear localStorage or redirect using a separate navigation handler
      localStorage.clear();
      sessionStorage.clear();
      window.location.href = "/"; // ⬅️ Hard redirect to login
    }

    return Promise.reject(error);
  }
);

export { axiosInstance };
