const environments = {
  local: {
    url: process.env.REACT_APP_BASE_DEV_URL,
    socketUrl: process.env.REACT_APP_SOCKET_DEV_URL,
  },
  staging: {
    url: process.env.REACT_APP_BASE_STAGING_URL,
    socketUrl: process.env.REACT_APP_SOCKET_STAGING_URL,
  },
  production: {
    url: process.env.REACT_APP_BASE_PROD_URL,
    socketUrl: process.env.REACT_APP_SOCKET_PROD_URL,
  },
};

const currentEnv = process.env.REACT_APP_ENV; // Default to local if not set

export const apiUrl = environments[currentEnv].url;
export const socketUrl = environments[currentEnv].socketUrl;
