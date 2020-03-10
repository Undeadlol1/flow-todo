import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type UiColorScheme = 'light' | 'dark';

export type UiState = {
  loading: boolean;
  isSidebarOpen: boolean;
  isAppTourActive: boolean;
  isRewardModalOpen: boolean;
  preferedColorScheme: UiColorScheme;
};

const prereferedColorScheme = localStorage.getItem(
  'prereferedColorScheme',
) as UiColorScheme | 'undefined';

const initialState: UiState = {
  loading: true,
  isSidebarOpen: false,
  isAppTourActive: false,
  isRewardModalOpen: false,
  preferedColorScheme:
    prereferedColorScheme === 'undefined'
      ? 'light'
      : prereferedColorScheme,
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
    toggleRewardModal(state) {
      state.isRewardModalOpen = !state.isRewardModalOpen;
    },
    setColorScheme(state, { payload }: PayloadAction<UiColorScheme>) {
      state.preferedColorScheme = payload;
      localStorage.setItem('prereferedColorScheme', payload);
    },
  },
});

export const {
  toggleAppTour,
  toggleSidebar,
  toggleRewardModal,
  setColorScheme,
} = uiSlice.actions;

export default uiSlice.reducer;
