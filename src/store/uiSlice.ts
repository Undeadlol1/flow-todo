import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type UiColorScheme = 'light' | 'dark';

export type UiState = {
  loading: boolean;
  snackbars: string[];
  isSidebarOpen: boolean;
  isAppTourActive: boolean;
  isRewardModalOpen: boolean;
  isTasksDoneTodayNotificationOpen: boolean;
  preferedColorScheme: UiColorScheme;
};

const prereferedColorScheme = localStorage.getItem(
  'prereferedColorScheme',
) as UiColorScheme | null;

const initialState: UiState = {
  snackbars: [],
  loading: true,
  isSidebarOpen: false,
  isAppTourActive: false,
  isRewardModalOpen: false,
  isTasksDoneTodayNotificationOpen: false,
  preferedColorScheme: prereferedColorScheme
    ? prereferedColorScheme
    : 'light',
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
    toggleTasksDoneTodayNotification(state) {
      state.isTasksDoneTodayNotificationOpen = !state.isTasksDoneTodayNotificationOpen;
    },
    setColorScheme(state, { payload }: PayloadAction<UiColorScheme>) {
      state.preferedColorScheme = payload;
      localStorage.setItem('prereferedColorScheme', payload);
    },
    // TODO rename
    setSnackbars(state, { payload }: PayloadAction<string[]>) {
      state.snackbars = payload;
    },
    // TODO rename? Rework?
    addSnackbarToQueue(state, { payload }: PayloadAction<string>) {
      state.snackbars.push(payload);
    },
  },
});

export const {
  toggleAppTour,
  toggleSidebar,
  toggleRewardModal,
  toggleTasksDoneTodayNotification,
  setColorScheme,
  addSnackbarToQueue,
  setSnackbars,
} = uiSlice.actions;

export default uiSlice.reducer;
