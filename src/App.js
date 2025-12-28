import React, { useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import getRoutesConfig from "./Features/Common/Shared/Utils/routesConfig";
import GlobalLoader from "./Features/Common/Shared/Components/Loader/GlobalLoader";
import { requestPermission, onMessageListener } from "./Features/Notification/Firebase/firebase";

function App() {
  const routesConfig = getRoutesConfig();

  useEffect(() => {
    requestPermission();
    onMessageListener().then((payload) => {
      console.log("Message received in foreground:", payload);
      // alert(payload?.notification?.title);
    });
  }, []);

  /* Intial Page for routing feature */
  return (
    <div>
      <GlobalLoader />
      <RouterProvider router={routesConfig} />
      <ToastContainer />
    </div>
  );
}

export default App;
