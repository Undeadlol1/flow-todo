import {
  combineReducers,
  configureStore,
  getDefaultMiddleware,
} from '@reduxjs/toolkit';
import subDays from 'date-fns/subDays';
import debug from 'debug';
import firebase, { firestore } from 'firebase/app';
import extend from 'lodash/extend';
import { snackbarReducer } from 'material-ui-snackbar-redux';
import nanoid from 'nanoid';
import { TypedUseSelectorHook, useSelector } from 'react-redux';
import { actionTypes, firebaseReducer } from 'react-redux-firebase';
import { firestoreReducer, reduxFirestore } from 'redux-firestore';
import {
  getFirestore,
  handleErrors,
  initializeFirebase,
} from '../services/index';
import rewardsSlice, { Reward } from './rewardsSlice';
import tasksSlice from './tasksSlice';
import uiSlice from './uiSlice';
import userSlice from './usersSlice';

const log = debug('store');
const { FieldValue } = firestore;

export type Profile = {
  userId: string;
  points: number;
  experience: number;
};

export type Subtask = {
  id: string;
  isDone: boolean;
  parentId: string;
  createdAt: number;
  name: string;
};

export type TaskHistory = {
  createdAt: number;
  comment?: string;
  actionType:
    | 'postpone'
    | 'updateName'
    | 'updateSubtask'
    | 'stepForward'
    | 'leapForward'
    | 'setDone';
};

export type Task = {
  id?: string;
  name: string;
  dueAt: number;
  doneAt?: number;
  userId: string;
  note?: string;
  isDone: boolean;
  isCurrent?: boolean;
  repetitionLevel?: number;
  subtasks?: Subtask[];
  history?: TaskHistory[];
  tags?: string[];
};

export function upsertTask(
  values: {
    name?: string;
    userId?: string;
    isCurrent?: boolean;
    tags?: string[];
  },
  taskId?: string,
): Promise<void | Error> {
  const isCreate = !taskId;
  const payload = extend(
    values,
    isCreate && {
      isDone: false,
      dueAt: subDays(new Date(), 1).getTime(),
    },
  );

  if (isCreate && !values.userId)
    return Promise.reject('You forgot to add userId');

  return getFirestore()
    .collection('tasks')
    .doc(taskId || nanoid())
    .set(payload, { merge: true });
}

export function deleteTask(taskId: string): Promise<void | Error> {
  return getFirestore()
    .doc('tasks/' + taskId)
    .delete();
}

export function createSubtask(
  taskId: string,
  values: {
    name: string;
  },
): Promise<void | Error> {
  return getFirestore()
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

export async function updateSubtask(
  subtask: Subtask,
  values: {
    name?: string;
    doneAt: number;
    isDone: boolean;
  },
): Promise<void | Error> {
  const docRef = getFirestore().doc('tasks/' + subtask.parentId);
  const task: any = await docRef.get();
  console.log('task: ', task);
  const newSubtasks: any[] = task.subtasks // .data()
    .map((i: Subtask) => {
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
  return getFirestore()
    .doc('tasks/' + taskId)
    .update({
      subtasks: FieldValue.arrayRemove(subtask),
    });
}

export function changeTags(taskId: string, tags: string[]) {
  return getFirestore()
    .doc('tasks/' + taskId)
    .update({ tags })
    .catch(handleErrors);
}

initializeFirebase();

export function upsertProfile(values: {
  userId: string;
  points: number;
}): Promise<void> {
  return getFirestore()
    .doc('profiles/' + values.userId)
    .set(values, { merge: true });
}

export function addPoints(
  userId: string,
  points: number,
): Promise<void> {
  log('addPoints.userId', userId);
  log('addPoints.points', points);
  return getFirestore()
    .doc('profiles/' + userId)
    .set(
      {
        userId,
        points: FieldValue.increment(points),
        experience: FieldValue.increment(points),
      },
      { merge: true },
    );
}

export function claimReward(reward: Reward) {
  const fs = getFirestore();
  return Promise.all([
    fs.doc('profiles/' + reward.userId).update({
      points: firestore.FieldValue.increment(reward.points * -1),
    }),
    fs.doc('rewards/' + reward.id).delete(),
  ]).catch(handleErrors);
}

const rootReducer = combineReducers({
  ui: uiSlice,
  users: userSlice,
  tasks: tasksSlice,
  rewards: rewardsSlice,
  snackbar: snackbarReducer,
  firebase: firebaseReducer,
  firestore: firestoreReducer,
});

const store = configureStore({
  reducer: rootReducer,
  middleware: [
    ...getDefaultMiddleware({
      // Firebase.auth onlogin error fix.
      // https://github.com/prescottprue/react-redux-firebase/issues/761
      serializableCheck: {
        ignoredActions: [actionTypes.LOGIN],
      },
    }),
  ],
  devTools: process.env.NODE_ENV !== 'test',
  enhancers: [reduxFirestore(firebase)],
});

export const useTypedSelector: TypedUseSelectorHook<
  ReturnType<typeof rootReducer>
> = useSelector;

export default store;
