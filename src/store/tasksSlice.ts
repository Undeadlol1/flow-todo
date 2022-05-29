import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Task } from '../entities/Task';

interface TasksState {
  tasks?: Task[];
  loading: boolean;
  error: string | null;
}

const initialState: TasksState = {
  tasks: [],
  error: null,
  loading: false,
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
  },
});

export const { getTasksSuccess } = tasksSlice.actions;

export default tasksSlice.reducer;
