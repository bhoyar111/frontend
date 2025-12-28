import { createSlice } from "@reduxjs/toolkit";

export const logsSlice = createSlice({
  name: "logs",
  initialState: {
    logs: {}
  },
  reducers: {
    loginLogs(state, action) {
      state.logs = action.payload;
    }
  }
});

export const { loginLogs } = logsSlice.actions;
export default logsSlice.reducer;
