import { createSlice } from '@reduxjs/toolkit';

const PageSlice = createSlice({
  name: 'page',
  initialState: {
    heading: ''
  },
  reducers: {
    setHeading: (state, action) => {
      state.heading = action.payload;
    }
  }
});

export const { setHeading } = PageSlice.actions;
export default PageSlice.reducer;
