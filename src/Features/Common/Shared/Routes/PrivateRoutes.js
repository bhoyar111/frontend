import AdminRoute from "./AdminRoute";
import CommonRoute from "./CommonRoute";
import ProviderRoute from "./ProviderRoute";

const PrivateRoutes = [
  ...CommonRoute,
  ...AdminRoute,
  ...ProviderRoute
];

export default PrivateRoutes;
