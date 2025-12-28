import { apiUrl } from "../../../../Config/Environment";

const ApiUrlConstant = {
  /* Auth */
  loginService: () => `${apiUrl}/auth/login`,
  forgotPassewordService: () => `${apiUrl}/auth/forgot-password`,
  logoutService: () => `${apiUrl}/auth/logout`,
  optSendService: () => `${apiUrl}/auth/sent-otp`,
  verifyOtpService: () => `${apiUrl}/auth/vertify-otp`,
  resetPasswordService: () => `${apiUrl}/auth/reset-password`,
  providerListService: () => `${apiUrl}/auth/get-user-list`,
  addEditProviderService: () => `${apiUrl}/auth/add-update-user-profile`,
  getByIdProviderService: () => `${apiUrl}/auth/get-user`,
  deleteProviderService: () => `${apiUrl}/auth/update-profile-status`,
  patientInvitationService: () => `${apiUrl}/auth/invite-patient`,
  
  /* State/Speciality */
  specialityListService: () => `${apiUrl}/auth/get-all-specialities`,
  stateListService: () => `${apiUrl}/auth/get-all-state`,
  userContactUsListService: () => `${apiUrl}/auth/get-user-contactus`,
  
  /* Login-Logs */
  loginLogsService: () => `${apiUrl}/auth/login-logs`,

};

export default ApiUrlConstant;
