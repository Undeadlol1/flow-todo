import { AuthError } from '@firebase/auth-types';
import firebase from 'firebase/app';
import countBy from 'lodash/countBy';
import filter from 'lodash/filter';
import get from 'lodash/fp/get';
import getOr from 'lodash/fp/getOr';
import isEmpty from 'lodash/isEmpty';
import isUndefined from 'lodash/isUndefined';
import shuffle from 'lodash/shuffle';
import uniq from 'lodash/uniq';
import includes from 'ramda/es/includes';
import { FirebaseReducer } from 'react-redux-firebase';
import { createSelector } from 'reselect';
import { DailyStreak } from '../entities/DailyStreak';
import { Profile } from '../entities/Profile';
import { Task } from '../entities/Task';
import { TaskHistory } from '../entities/TaskHistory';
import { activeTagsSelector } from '../features/tags/store/tagsSelectors';
import { AnimationState } from './animationSlice';
import { RootReducer } from './index';
import { Reward } from './rewardsSlice';
import { SnackbarsState } from './snackbarsSlice';
import { UiState } from './uiSlice';
import { UsersState } from './usersSlice';

export const fetchedTasksSelector = createSelector<any, Task[]>(
  get('firestore.ordered.tasks'),
  (tasks: Task[]): Task[] => tasks,
);

export const taskLogsSelector = createSelector<any, TaskHistory[]>(
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
        'doneSubtask',
      ]),
    ).true || 0,
);

export const tasksSelector = createSelector(
  fetchedTasksSelector,
  activeTagsSelector,
  (tasks: Task[], activeTags) => {
    // This is needed to check that tasks are loading.
    if (isUndefined(tasks)) return tasks;

    if (activeTags.length !== 0) {
      return filter(shuffle(tasks), ({ tags = [] }) =>
        tags.some((tag) =>
          activeTags.includes(tag.toLowerCase().trim()),
        ),
      );
    }

    return shuffle(tasks);
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
          allTags.push(tag.toLowerCase().trim()),
        );
      });
    return uniq(allTags);
  },
);

export const fetchedTaskSelector = createSelector<any, Task>(
  get('firestore.ordered.currentTask[0]'),
  (task: Task) => (task || {}) as Task,
);

export const rewardsSelector = createSelector<any, Reward[]>(
  get('firestore.ordered.rewards'),
  (rewards: Reward[]) => rewards as Reward[],
);

export const profileSelector = createSelector<any, Profile>(
  get('firebase.profile'),
  // Add default values to profile.
  (value: Profile) => {
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
      } as DailyStreak;
    }
    return profile as Profile;
  },
);

export const profilePointsSelector = createSelector<any, number>(
  profileSelector,
  getOr(0, 'points'),
);

export const authSelector = createSelector(
  get('firebase.auth'),
  (auth: any) =>
    auth as firebase.UserInfo & FirebaseReducer.AuthState,
);

export const authErrorSelector = createSelector(
  get('firebase.authError'),
  (error: any) => error as AuthError,
);

export const firestoreStatusSelector = (state: RootReducer) =>
  state.firestore.status;

export const uiSelector = createSelector<any, UiState>(
  get('ui'),
  (ui: UiState) => ui,
);

export const animationSelector = createSelector<any, AnimationState>(
  get('animation'),
  (animation: AnimationState) => animation,
);

export const usersSelector = createSelector<any, UsersState>(
  get('users'),
  (users: UsersState) => users,
);

export const userIdSelector = get('firebase.auth.uid');
