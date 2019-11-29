import { createSlice } from '@reduxjs/toolkit';

export type UiState = {
  loading: boolean;
  isAppTourActive: boolean;
};

const initialState: UiState = {
  loading: true,
  isAppTourActive: false,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleAppTour(state) {
      state.isAppTourActive = !state.isAppTourActive;
    },
  },
});

export const { toggleAppTour } = uiSlice.actions;

export default uiSlice.reducer;
