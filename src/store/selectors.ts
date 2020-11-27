import { AuthError } from '@firebase/auth-types';
import firebase from 'firebase/app';
import countBy from 'lodash/countBy';
import filter from 'lodash/filter';
import get from 'lodash/fp/get';
import getOr from 'lodash/fp/getOr';
import isEmpty from 'lodash/isEmpty';
import isUndefined from 'lodash/isUndefined';
import uniq from 'lodash/uniq';
import includes from 'ramda/es/includes';
import { FirebaseReducer } from 'react-redux-firebase';
import { createSelector } from 'reselect';
import { IDayliStreak } from '../entities/IDayliStreak';
import { Profile } from '../entities/Profile';
import { Task } from '../entities/Task';
import { TaskHistory } from '../entities/TaskHistory';
import { RootReducer } from './index';
import { Reward } from './rewardsSlice';
import { SnackbarsState } from './snackbarsSlice';
import { UiState } from './uiSlice';
import { UsersState } from './usersSlice';
import { AnimationState } from './animationSlice';

export const fetchedTasksSelector = createSelector(
  get('firestore.ordered.tasks'),
  (tasks: Task[]) => tasks,
);

export const taskLogsSelector = createSelector(
  get('firestore.ordered.taskLogs'),
  (tasks: TaskHistory[]) => tasks,
);

export const tasksDoneTodaySelector = createSelector(
  taskLogsSelector,
  (logs) =>
    countBy(logs, (log) =>
      includes(log.actionType, [
        'stepForward',
        'leapForward',
        'setDone',
      ]),
    ).true || 0,
);

export const excludedTagsSelector = (state: RootReducer) =>
  state.tasks.excludedTags;

export const tasksSelector = createSelector(
  fetchedTasksSelector,
  excludedTagsSelector,
  (tasks: Task[], excludedTags) => {
    // This is needed to check that tasks are loading.
    if (isUndefined(tasks)) return tasks;
    return filter(
      tasks,
      ({ tags = [] }) =>
        !tags.some((tag) => excludedTags.includes(tag.toLowerCase())),
    );
  },
);

export const activeTaskSelector = createSelector(
  tasksSelector,
  (tasks: Task[] = []) => tasks.find((i) => !!i.isCurrent),
);

export const tagsOfFetchedTasksSelector = createSelector(
  fetchedTasksSelector,
  (tasks: Task[] = []): string[] => {
    let allTags: string[] = [];
    (tasks || [])
      .filter((t) => !isEmpty(t.tags))
      .forEach((t) => {
        (t.tags as string[]).forEach((tag) =>
          allTags.push(tag.toLowerCase()),
        );
      });
    return uniq(allTags);
  },
);

export const pinnedTaskSelector = createSelector(
  get('firestore.ordered.pinnedTask[0]'),
  (task) => (task || {}) as Task,
);

export const fetchedTaskSelector = createSelector(
  get('firestore.ordered.currentTask[0]'),
  (task) => (task || {}) as Task,
);

export const rewardsSelector = createSelector(
  get('firestore.ordered.rewards'),
  (rewards) => rewards as Reward[],
);

export const profileSelector = createSelector(
  get('firebase.profile'),
  // Add default values to profile.
  (value) => {
    // New object is created to avoid "no mutations" error.
    const profile = Object.assign(
      {},
      (value || {
        experience: 0,
        points: 0,
      }) as Profile,
    );
    if (!profile.dailyStreak) {
      profile.dailyStreak = {
        perDay: 3,
        startsAt: null,
        updatedAt: null,
      } as IDayliStreak;
    }
    return profile as Profile;
  },
);

export const profilePointsSelector = createSelector(
  profileSelector,
  getOr(0, 'points'),
);

export const authSelector = createSelector(
  get('firebase.auth'),
  (auth) => auth as firebase.UserInfo & FirebaseReducer.AuthState,
);

export const authErrorSelector = createSelector(
  get('firebase.authError'),
  (error) => error as AuthError,
);

export const firestoreStatusSelector = (state: RootReducer) =>
  state.firestore.status;

export const uiSelector = createSelector(
  get('ui'),
  (ui) => ui as UiState,
);

export const animationSelector = createSelector(
  get('animation'),
  (animation) => animation as AnimationState,
);

export const usersSelector = createSelector(
  get('users'),
  (users) => users as UsersState,
);

export const snackbarsSelector = createSelector(
  get('snackbars'),
  (i) => i as SnackbarsState,
);

export const userIdSelector = get('firebase.auth.uid');
