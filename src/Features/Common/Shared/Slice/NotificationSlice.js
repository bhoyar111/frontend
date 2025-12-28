import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  unreadCount: 0
};

const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    setUnreadCount: (state, action) => {
      state.unreadCount = action.payload;
    },
    incrementUnreadCount: (state) => {
      state.unreadCount += 1;
    },
    decrementUnreadCount: (state) => {
      state.unreadCount = Math.max(0, state.unreadCount - 1);
    }
  }
});

export const { setUnreadCount, incrementUnreadCount, decrementUnreadCount } =
  notificationSlice.actions;

export default notificationSlice.reducer;
