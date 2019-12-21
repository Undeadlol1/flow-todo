import { AuthError } from '@firebase/auth-types';
import { UserInfo } from 'firebase/app';
import extend from 'lodash/extend';
import get from 'lodash/fp/get';
import getOr from 'lodash/fp/getOr';
import { FirebaseReducer } from 'react-redux-firebase';
import { createSelector } from 'reselect';
import { Profile, Task } from './index';
import { Reward } from './rewardsSlice';
import { UiState } from './uiSlice';
import { UsersState } from './usersSlice';

export const activeTasksSelector = createSelector(
  get('firestore.ordered.tasks'),
  activeTasks => activeTasks as Task[],
);

export const activeTaskSelector = createSelector(
  activeTasksSelector,
  (tasks: Task[] = []) => tasks.find(i => !!i.isCurrent),
);

export const pinnedTaskSelector = createSelector(
  getOr({}, 'firestore.data.activeTasks'),
  (tasks: any) => {
    let taskId = '';
    Object.getOwnPropertyNames(tasks).forEach(id => {
      if (tasks[id] && tasks[id].isPinned) taskId = id;
    });
    return extend(tasks[taskId], {
      id: taskId,
    }) as Task;
  },
);

export const currentTaskSelector = createSelector(
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

export const uiSelector = createSelector(
  get('ui'),
  ui => ui as UiState,
);

export const usersSelector = createSelector(
  get('users'),
  users => users as UsersState,
);
