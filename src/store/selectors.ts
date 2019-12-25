import { AuthError } from '@firebase/auth-types';
import { UserInfo } from 'firebase/app';
import get from 'lodash/fp/get';
import getOr from 'lodash/fp/getOr';
import { FirebaseReducer } from 'react-redux-firebase';
import { createSelector } from 'reselect';
import { Profile, Task, RootReducer } from './index';
import { Reward } from './rewardsSlice';
import { UiState } from './uiSlice';
import { UsersState } from './usersSlice';
import isUndefined from 'lodash/isUndefined';

export const tasksSelector = createSelector(
  get('firestore.ordered.tasks'),
  (tasks: Task[]) => {
    if (isUndefined(tasks)) return tasks;
    return tasks.filter(i => !i.isPinned);
  },
);

export const activeTaskSelector = createSelector(
  tasksSelector,
  (tasks: Task[] = []) => tasks.find(i => !!i.isCurrent),
);

export const pinnedTaskSelector = createSelector(
  get('firestore.ordered.pinnedTask[0]'),
  task => (task || {}) as Task,
);

export const fetchedTaskSelector = createSelector(
  get('firestore.ordered.currentTask[0]'),
  task => (task || {}) as Task,
);

export const rewardsSelector = createSelector(
  get('firestore.ordered.rewards'),
  rewards => rewards as Reward[],
);

export const profileSelector = createSelector(
  get('firebase.profile'),
  profile => profile as Profile,
);

export const profilePointsSelector = createSelector(
  profileSelector,
  getOr(0, 'points'),
);

export const authSelector = createSelector(
  get('firebase.auth'),
  auth => auth as UserInfo & FirebaseReducer.AuthState,
);

export const authErrorSelector = createSelector(
  get('firebase.authError'),
  error => error as AuthError,
);

export const firestoreStatusSelector = (state: RootReducer) =>
  state.firestore.status;

export const uiSelector = createSelector(
  get('ui'),
  ui => ui as UiState,
);

export const usersSelector = createSelector(
  get('users'),
  users => users as UsersState,
);
