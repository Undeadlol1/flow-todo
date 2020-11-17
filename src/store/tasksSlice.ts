import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import xor from 'lodash/xor';
import { Task } from '../entities/Task';

interface TasksState {
  tasks?: Task[];
  loading: boolean;
  error: string | null;
  // NOTE: there might be a situation where only one array is used
  excludedTags: string[];
}

const initialState: TasksState = {
  tasks: [],
  error: null,
  loading: false,
  excludedTags: [],
};

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    getTasksSuccess(
      state,
      action: PayloadAction<Task[] | undefined>,
    ) {
      state.tasks = action.payload ? action.payload : [];
      state.loading = false;
      state.error = null;
    },
    toggleTag(state, action: PayloadAction<string>) {
      state.excludedTags = xor(state.excludedTags, [action.payload]);
    },
  },
});

export const { toggleTag, getTasksSuccess } = tasksSlice.actions;

export default tasksSlice.reducer;
