import CryptoJS from "crypto-js";

const SECRET_KEY = process.env.REACT_APP_SECRET_KEY;
const ADD_CRYPTO = process.env.REACT_APP_ADD_CRYPTO === "true";

export const isCryptoEnabled = () => ADD_CRYPTO;

export const encryptData = (data) => {
  if (!ADD_CRYPTO) return data;
  try {
    return CryptoJS.AES.encrypt(JSON.stringify(data), SECRET_KEY).toString();
  } catch (error) {
    throw new Error("Encryption failed", error);
  }
};

export const decryptData = (ciphertext) => {
  if (!ADD_CRYPTO) return ciphertext;
  try {
    const bytes = CryptoJS.AES.decrypt(ciphertext, SECRET_KEY);
    const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    return decryptedData;
  } catch (error) {
    throw new Error("Decryption failed", error);
  }
};
