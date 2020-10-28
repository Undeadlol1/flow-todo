import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type UiState = {
  snackbars: string[];
};

const initialState: UiState = {
  snackbars: [],
};

const snackbarsSlice = createSlice({
  name: 'snackbars',
  initialState,
  reducers: {
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
  addSnackbarToQueue,
  setSnackbars,
} = snackbarsSlice.actions;

export default snackbarsSlice.reducer;
