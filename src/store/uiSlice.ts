import { createSlice } from '@reduxjs/toolkit';
import { UiState } from './ui';

const initialState: UiState = {
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
