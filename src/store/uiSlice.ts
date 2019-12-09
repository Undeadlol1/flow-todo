import { createSlice } from '@reduxjs/toolkit';

export type UiState = {
  loading: boolean;
  isSidebarOpen: boolean;
  isAppTourActive: boolean;
};

const initialState: UiState = {
  loading: true,
  isSidebarOpen: false,
  isAppTourActive: false,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleAppTour(state) {
      state.isAppTourActive = !state.isAppTourActive;
    },
    toggleSidebar(state) {
      state.isSidebarOpen = !state.isSidebarOpen;
    },
  },
});

export const { toggleAppTour, toggleSidebar } = uiSlice.actions;

export default uiSlice.reducer;
