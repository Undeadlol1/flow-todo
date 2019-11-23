import { createContext } from 'react';
import { firestore } from 'firebase';

type ContextProps = {
  loading: boolean;
  tasks: firestore.QuerySnapshot;
  tasksDoneToday: firestore.QuerySnapshot;
};

export const TasksContext = createContext({
  tasks: {},
  loading: true,
  tasksDoneToday: {},
} as Partial<ContextProps>);
