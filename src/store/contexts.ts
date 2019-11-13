import { createContext } from 'react';

export const TasksContext = createContext({
  tasks: [],
  error: null,
  loading: false,
  currentTask: {},
});
