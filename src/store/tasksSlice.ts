import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Task } from './index';

// TODO remove unused properties
interface TasksState {
  tasks?: Task[];
  loading: boolean;
  error: string | null;
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
    excludeTag(state, action: PayloadAction<string>) {
      state.excludedTags.push(action.payload);
    },
  },
});

export const { excludeTag, getTasksSuccess } = tasksSlice.actions;

export default tasksSlice.reducer;
