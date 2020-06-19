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
import {
  firestoreReducer,
  getFirestore as getFirestore2,
  reduxFirestore,
} from 'redux-firestore';
import {
  getFirestore,
  getNewlyUnlockedReward,
  handleErrors,
  initializeFirebase,
  showLevelUpAnimation,
  willUserLevelUp,
} from '../services/index';
import rewardsSlice, { Reward } from './rewardsSlice';
import {
  authSelector,
  profilePointsSelector,
  rewardsSelector,
} from './selectors';
import tasksSlice from './tasksSlice';
import uiSlice, { toggleRewardModal } from './uiSlice';
import userSlice from './usersSlice';

const log = debug('store');
const { FieldValue } = firestore;

export type DayliStreak = {
  startsAt: Date;
  updatedAt: Date;
};

export type Profile = {
  userId: string;
  points: number;
  experience: number;
  dailyStreak: DayliStreak;
  isLoaded: boolean; // react-redux-firebase specific props
  isEmpty: boolean; // react-redux-firebase specific props;
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
  id: string;
  name: string;
  dueAt: number;
  doneAt?: number;
  userId: string;
  note?: string;
  isDone: boolean;
  isCurrent?: boolean;
  isPinned?: boolean;
  repetitionLevel?: number;
  subtasks?: Subtask[];
  history?: TaskHistory[];
  tags?: string[];
};

export function createTask(values: {
  id?: string;
  name: string;
  userId: string;
  note?: string;
  tags?: string[];
  subtasks?: Subtask[];
}) {
  return (
    getFirestore()
      .collection('tasks')
      .doc(values.id || nanoid())
      // TODO: was tired while writing this code.
      // Is this correct*
      .set(
        extend(values, {
          isDone: false,
          cratedAt: Date.now(),
          dueAt: subDays(new Date(), 1).getTime(),
        }),
        { merge: true },
      )
      .catch(handleErrors)
  );
}

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
    .set(payload, { merge: true })
    .catch(handleErrors);
}

export function deleteTask(taskId: string): Promise<void | Error> {
  return getFirestore()
    .doc('tasks/' + taskId)
    .delete();
}
// NOTE: WIP
export function createSubtask(
  taskId: string,
  values: {
    name: string;
  },
): Promise<void | Error> {
  console.log('taskId: ', taskId);
  return (
    getFirestore2(firebase)
      // return getFirestore()
      .update(
        { collection: 'tasks', doc: taskId },
        {
          // TODO: this might be the reason of "id" dissapearing from Task
          // TODO: Use firestore from from redux-firestore
          subtasks: FieldValue.arrayUnion({
            // TODO: this might be the reason of "id" dissapearing from Task
            id: nanoid(),
            isDone: false,
            parentId: taskId,
            createdAt: Date.now(),
            name: values.name.trim(),
          }),
        },
      )
  );
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

export function upsertProfile(
  userId: string,
  values: Profile,
): Promise<void> {
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
    )
    .catch(handleErrors);
}

export function addPointsWithSideEffects(
  userId: string,
  points: number,
): Promise<void> {
  const state = store.getState();
  const auth = authSelector(state);
  const profilePoints = profilePointsSelector(state);
  const nextReward = getNewlyUnlockedReward(
    profilePoints,
    points,
    rewardsSelector(state),
  );
  // TODO refactor
  if (nextReward) store.dispatch(toggleRewardModal());
  if (willUserLevelUp(profilePoints, points)) showLevelUpAnimation();

  return addPoints(auth.uid, points);
}

export function claimReward(reward: Reward) {
  try {
    const fs = getFirestore();
    if (!reward.isReccuring) fs.doc('rewards/' + reward.id).delete();
    fs.doc('profiles/' + reward.userId).update({
      points: firestore.FieldValue.increment(reward.points * -1),
    });
  } catch (error) {
    handleErrors(error);
  }
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

export type RootReducer = ReturnType<typeof rootReducer>;

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
