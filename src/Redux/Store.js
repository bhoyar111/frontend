import { configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import { combineReducers } from "redux";
import storage from "redux-persist/lib/storage";
import AuthSlice from "../Features/Common/Shared/Slice/AuthSlice";
import ProfileSlice from "../Features/Common/Shared/Slice/ProfileSlice";
import LoaderSlice from "../Features/Common/Shared/Slice/LoaderSlice";
import PageReducer from "../Features/Common/Shared/Slice/PageSlice";
import LogsSlice from "../Features/Common/Shared/Slice/LogsSlice";
import SidebarReducer from "../Features/Common/Shared/Slice/SidebarSlice";

const rootReducer = combineReducers({
  auth: AuthSlice,
  user: ProfileSlice,
  loader: LoaderSlice,
  page: PageReducer,
  logs: LogsSlice,
  sidebar: SidebarReducer
});

const persistConfig = {
  key: "root",
  storage
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"]
      }
    })
});

export const persistor = persistStore(store);
