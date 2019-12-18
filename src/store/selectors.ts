import { UserInfo } from 'firebase/app';
import get from 'lodash/fp/get';
import getOr from 'lodash/fp/getOr';
import { FirebaseReducer } from 'react-redux-firebase';
import { createSelector } from 'reselect';
import { Profile, Task } from './index';
import { Reward } from './rewardsSlice';
import { UiState } from './uiSlice';

export const activeTasksSelector = createSelector(
  get('firestore.ordered.activeTasks'),
  activeTasks => activeTasks as Task[],
);

export const currentTaskSelector = createSelector(
  get('firestore.ordered.currentTask[0'),
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

export const uiSelector = createSelector(
  get('ui'),
  ui => ui as UiState,
);
