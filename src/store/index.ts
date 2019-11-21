import nanoid from 'nanoid';
import { firestore } from 'firebase/app';
import subtractDays from 'date-fns/subDays';
import {
  configureStore,
  getDefaultMiddleware,
  combineReducers,
} from '@reduxjs/toolkit';
import tasksSlice from './tasksSlice';
import uiSlice from './uiSlice';
import { useSelector, TypedUseSelectorHook } from 'react-redux';
import extend from 'lodash/extend';

const { FieldValue } = firestore;

export type Task = {
  id?: string;
  name: string;
  dueAt: number;
  doneAt?: number;
  userId: string;
  note?: string;
  subtasks?: any[];
  isDone: boolean;
  isCurrent?: boolean;
  repetitionLevel?: number;
};

export function upsertTask(
  values: { name?: string; userId?: string; isCurrent?: boolean },
  taskId?: string,
): Promise<void | Error> {
  const isCreate = !taskId;
  const payload = extend(
    values,
    isCreate && {
      isDone: false,
      dueAt: subtractDays(new Date(), 1).getTime(),
    },
  );

  if (isCreate && !values.userId)
    return Promise.reject('You forgot to add userId');

  return firestore()
    .collection('tasks')
    .doc(taskId || nanoid())
    .set(payload, { merge: true });
}

export function deleteTask(taskId: string): Promise<void | Error> {
  return firestore()
    .doc('tasks/' + taskId)
    .delete();
}

export function createSubtask(
  taskId: string,
  values: {
    name: string;
  },
): Promise<void | Error> {
  return firestore()
    .doc('tasks/' + taskId)
    .update({
      subtasks: FieldValue.arrayUnion({
        id: nanoid(),
        isDone: false,
        parentId: taskId,
        createdAt: Date.now(),
        name: values.name.trim(),
      }),
    });
}

export type Subtask = {
  id: string;
  isDone: boolean;
  parentId: string;
  createdAt: number;
  name: string;
};

export async function updateSubtask(
  subtask: Subtask,
  values: {
    name?: string;
    doneAt: number;
    isDone: boolean;
  },
): Promise<void | Error> {
  const docRef = firestore().doc('tasks/' + subtask.parentId);
  const task: any = await docRef.get();
  const newSubtasks: any[] = task
    .data()
    .subtasks.map((i: Subtask) => {
      return i.id === subtask.id ? Object.assign({}, i, values) : i;
    });
  return docRef.update({
    subtasks: newSubtasks,
  });
}

export function deleteSubtask(
  taskId: string,
  subtask: {
    id: string;
  },
): Promise<void | Error> {
  return firestore()
    .doc('tasks/' + taskId)
    .update({
      subtasks: FieldValue.arrayRemove(subtask),
    });
}

export function upsertProfile(values: {
  userId: string;
  points: number;
}): Promise<void> {
  return firestore()
    .doc('profiles/' + values.userId)
    .set(values, { merge: true });
}

export function addPoints(
  userId: string,
  points: number,
): Promise<void> {
  return firestore()
    .doc('profiles/' + userId)
    .set(
      { userId, points: FieldValue.increment(points) },
      { merge: true },
    );
}

const rootReducer = combineReducers({
  ui: uiSlice,
  tasks: tasksSlice,
});

const store = configureStore({
  reducer: rootReducer,
  middleware: [...getDefaultMiddleware()],
  devTools: process.env.NODE_ENV !== 'production',
  enhancers: [],
});

export const useTypedSelector: TypedUseSelectorHook<
  ReturnType<typeof rootReducer>
> = useSelector;

export default store;
// The store has been created with these options:
// - The slice reducers were automatically passed to combineReducers()
// - redux-thunk and redux-logger were added as middleware
// - The Redux DevTools Extension is disabled for production
// - The middleware, batch, and devtools enhancers were automatically composed together
