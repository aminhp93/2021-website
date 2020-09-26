import { createSlice } from "@reduxjs/toolkit";

const faviconKeySlice = createSlice({
  name: 'faviconKey',
  initialState: 'default',
  reducers: {
    faviconKeySuccess: (state, { payload }) => payload,
  },
});

export const {
  faviconKeySuccess,
} = faviconKeySlice.actions;

export const faviconKey = faviconKeySlice.reducer;
