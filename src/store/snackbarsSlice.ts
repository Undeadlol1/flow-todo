import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type SnackbarsState = {
  queue: string[];
};

const initialState: SnackbarsState = {
  queue: [],
};

const snackbarsSlice = createSlice({
  initialState,
  name: 'snackbars',
  reducers: {
    updateSnackbarsQueue(
      state,
      { payload }: PayloadAction<string[]>,
    ) {
      state.queue = payload;
    },
    addSnackbarToQueue(state, { payload }: PayloadAction<string>) {
      state.queue.push(payload);
    },
  },
});

export const {
  addSnackbarToQueue,
  updateSnackbarsQueue,
} = snackbarsSlice.actions;

export default snackbarsSlice.reducer;
