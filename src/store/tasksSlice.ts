import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Task } from './index';
import filter from 'lodash/filter';

// TODO remove unused properties
interface TasksState {
  tasks?: Task[];
  loading: boolean;
  error: string | null;
  // NOTE: there might be a situation where only one array is used
  // TODO: make sure only relevant code exists
  activeTags: string[];
  // TODO: change to "inactiveTags"?
  excludedTags: string[];
}

const initialState: TasksState = {
  tasks: [],
  error: null,
  loading: false,
  activeTags: [],
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
      state.activeTags = filter(
        state.activeTags,
        tag => tag !== action.payload,
      );
    },
    includeTag(state, { payload }: PayloadAction<string>) {
      state.activeTags.push(payload);
      state.excludedTags = filter(
        state.excludedTags,
        tag => tag !== payload,
      );
    },
  },
});

export const {
  excludeTag,
  includeTag,
  getTasksSuccess,
} = tasksSlice.actions;

export default tasksSlice.reducer;
