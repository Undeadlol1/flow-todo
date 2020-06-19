import differenceInDays from 'date-fns/differenceInDays';
import debug from 'debug';
import filter from 'lodash/filter';
import find from 'lodash/find';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import { snackbarActions } from 'material-ui-snackbar-redux';
import React, { memo, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useFirestore } from 'react-redux-firebase';
import { useHistory, useParams } from 'react-router-dom';
import { getRandomTaskId, handleErrors } from '../../services';
import { showSnackbar } from '../../services/index';
import { deleteTask } from '../../store';
import {
  addPointsWithSideEffects,
  Task,
  TaskHistory,
  useTypedSelector,
} from '../../store/index';
import {
  authSelector,
  fetchedTaskSelector,
  firestoreStatusSelector,
  profileSelector,
  tasksDoneTodaySelector,
  tasksSelector,
} from '../../store/selectors';
import TaskPage from './TaskPage';

const log = debug('TaskPageContainer');

export interface updateTaskParams {
  values: any;
  pointsToAdd?: number;
  snackbarMessage: string;
  history: TaskHistory;
}

export interface deleteTaskArguments {
  pointsToAdd?: number;
  snackbarMessage?: string;
}

export default memo(() => {
  const [t] = useTranslation();
  const history = useHistory();
  const dispatch = useDispatch();
  const firestoreRedux = useFirestore();

  const { taskId = '' } = useParams();
  const isAppIntroMode = taskId === 'introExample';
  const [isRequested, setRequested] = useState(false);
  const firestoreStatus = useTypedSelector(firestoreStatusSelector);
  const profile = useTypedSelector(profileSelector);
  const auth = useTypedSelector(authSelector);
  const tasksDoneToday = useTypedSelector(tasksDoneTodaySelector);

  const tasks = useTypedSelector(tasksSelector) || [];
  const fetchedTask = useTypedSelector(fetchedTaskSelector);
  let task = find(tasks, ['id', taskId]) || fetchedTask;

  // Fetch task if needed
  useEffect(() => {
    if (
      !isAppIntroMode &&
      get(firestoreStatus, 'requested.activeTasks') &&
      get(task, 'id') !== taskId &&
      !isRequested
    ) {
      log('task fetching is in progress');
      setRequested(true);
      firestoreRedux
        .get({
          doc: taskId,
          collection: 'tasks',
          storeAs: 'currentTask',
        })
        .then(() => setRequested(false))
        .catch(error => {
          handleErrors(error);
          history.push('/');
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [task, isRequested, firestoreStatus, isAppIntroMode, taskId]);

  // TODO find out how to get errors from redux-firestore
  // if (taskError) once(() => handleErrors(taskError))();

  if (isAppIntroMode) {
    task = {
      name: t('exampleTask'),
    } as Task;
  }

  const nextTaskId = getRandomTaskId(
    filter(tasks, t => t.id !== taskId),
  );
  log('taskId: ', taskId);
  log('nextTaskId: ', nextTaskId);

  async function activateNextTask() {
    return nextTaskId
      ? firestoreRedux.doc('tasks/' + nextTaskId).update({
          ...tasks.find(t => t.id === nextTaskId),
          isCurrent: true,
        })
      : Promise.resolve();
  }

  console.log('streak: ', profile.dailyStreak);
  async function updateDailyStreak() {
    const now = Date.now();
    const streak = profile.dailyStreak;
    const isUpdatedToday =
      differenceInDays(streak.updatedAt, now) === 0;
    const isStreakBroken =
      !streak.startsAt ||
      differenceInDays(streak.updatedAt, now) >= 1;
    console.log('isUpdatedToday: ', isUpdatedToday);
    console.log('isStreakBroken: ', isStreakBroken);
    console.log('tasksDoneToday: ', tasksDoneToday);
    console.log('profile: ', profile);
    if (tasksDoneToday + 1 > 3 && !isUpdatedToday) {
      const payload = Object.assign({}, profile, {
        dailyStreak: {
          updatedAt: now,
          startsAt: isStreakBroken ? now : streak.startsAt,
        },
      });
      console.log('payload: ', payload);
      return firestoreRedux
        .doc('profiles/' + auth.uid)
        .update(payload);
    }
  }

  const mergedProps = {
    async updateTask({
      values,
      snackbarMessage,
      pointsToAdd = 10,
      history: historyToAdd,
    }: updateTaskParams) {
      try {
        showSnackbar(snackbarMessage);
        history.push(nextTaskId ? '/tasks/' + nextTaskId : '/');

        await Promise.all([
          await firestoreRedux.doc('tasks/' + taskId).update({
            ...task,
            ...values,
            // TODO make sure subcollections instead of array are
            // working properly and remove this line
            history: [...get(task, 'history', []), historyToAdd],
          }),
          await firestoreRedux.collection('taskLogs').add({
            ...historyToAdd,
            taskId: taskId,
            userId: task.userId,
            createdAt: Date.now(),
          }),
          await addPointsWithSideEffects(task.userId, pointsToAdd),
          await activateNextTask(),
          await updateDailyStreak(),
        ]);
      } catch (error) {
        handleErrors(error);
        if (error.message.includes('Null value error.')) {
          return history.push('/');
        }
        history.push('/tasks/' + taskId);
      }
    },
    async deleteTask(options: deleteTaskArguments = {}) {
      setRequested(true);
      try {
        await Promise.all([
          deleteTask(taskId),
          addPointsWithSideEffects(task.userId, 10),
          activateNextTask(),
        ]);
        dispatch(
          snackbarActions.show({
            message:
              options.snackbarMessage || t('successfullyDeleted'),
            action: t('undo'),
            async handleAction() {
              await Promise.all([
                firestoreRedux.doc('tasks/' + taskId).set(task),
                addPointsWithSideEffects(
                  task.userId,
                  options.pointsToAdd || -10,
                ),
              ]);
              history.push(`/tasks/${taskId}`);
            },
          }),
        );
        history.push(nextTaskId ? '/tasks/' + nextTaskId : '/');
      } catch (error) {
        handleErrors(error);
        history.push(`/tasks/${taskId}`);
      } finally {
        setRequested(false);
      }
    },
    task: task || {},
    loading: isEmpty(task) || isRequested,
    taskId,
    isAppIntroMode,
  };
  return <TaskPage {...mergedProps} />;
});
