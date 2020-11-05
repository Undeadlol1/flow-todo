import {
  combineReducers,
  configureStore,
  getDefaultMiddleware,
} from '@reduxjs/toolkit';
import debug from 'debug';
import firebase from 'firebase/app';
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
} from '../services/index';
import LevelingService from '../services/leveling';
import rewardsSlice, { Reward } from './rewardsSlice';
import {
  authSelector,
  profilePointsSelector,
  rewardsSelector,
} from './selectors';
import tasksSlice from './tasksSlice';
import uiSlice, { toggleRewardModal } from './uiSlice';
import userSlice from './usersSlice';
import snackbarsSlice from './snackbarsSlice';
import { getUniqueId } from '../helpers/getUniqueId';

const log = debug('store');
const { FieldValue } = firebase.firestore;

export type IDayliStreak = {
  perDay: number;
  startsAt: number | null;
  updatedAt: number | null;
};

export interface FirebaseUserProfile {
  uid: string;
  email: string;
  photoURL?: string;
  displayName: string;
}

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
  userId: string;
  note?: string;
  isDone: boolean;
  isCurrent?: boolean;
  isPinned?: boolean;
  repetitionLevel?: number;
  subtasks?: Subtask[];
  history?: TaskHistory[];
  tags?: string[];
  dueAt: number;
  doneAt?: number;
  createdAt: number;
  updatedAt?: number;
};

// NOTE: WIP
export function createSubtask(
  taskId: string,
  values: {
    name: string;
  },
): Promise<void | Error> {
  console.log('taskId: ', taskId);
  return (
    // @ts-ignore
    getFirestore2(firebase)
      // return getFirestore()
      .update(
        { collection: 'tasks', doc: taskId },
        {
          // TODO: this might be the reason of "id" dissapearing from Task
          // TODO: Use firestore from from redux-firestore
          subtasks: FieldValue.arrayUnion({
            // TODO: this might be the reason of "id" dissapearing from Task
            id: getUniqueId(),
            isDone: false,
            parentId: taskId,
            createdAt: Date.now(),
            name: values.name.trim(),
          }),
        },
      )
  );
}

export function changeTags(taskId: string, tags: string[]) {
  return getFirestore()
    .doc('tasks/' + taskId)
    .update({ tags })
    .catch(handleErrors);
}

initializeFirebase();

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

const rootReducer = combineReducers({
  ui: uiSlice,
  users: userSlice,
  tasks: tasksSlice,
  rewards: rewardsSlice,
  snackbars: snackbarsSlice,
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
  // @ts-ignore
  enhancers: [reduxFirestore(firebase)],
});

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
  if (LevelingService.willUserLevelUp(profilePoints, points)) {
    showLevelUpAnimation();
  }

  return addPoints(auth.uid, points);
}

export function claimReward(reward: Reward) {
  try {
    const fs = getFirestore();
    if (!reward.isReccuring) fs.doc('rewards/' + reward.id).delete();
    fs.doc('profiles/' + reward.userId).update({
      points: FieldValue.increment(reward.points * -1),
    });
  } catch (error) {
    handleErrors(error);
  }
}

export type RootReducer = ReturnType<typeof rootReducer>;

export const useTypedSelector: TypedUseSelectorHook<ReturnType<
  typeof rootReducer
>> = useSelector;

export default store;
