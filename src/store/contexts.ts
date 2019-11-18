import { createContext } from 'react';
import { firestore } from 'firebase';

type ContextProps = {
  tasks: firestore.QuerySnapshot;
  loading: boolean;
};

export const TasksContext = createContext(<Partial<ContextProps>>{
  tasks: {},
  loading: true,
});
