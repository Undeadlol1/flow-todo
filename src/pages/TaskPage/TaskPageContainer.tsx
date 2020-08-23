import debug from 'debug';
import filter from 'lodash/filter';
import find from 'lodash/find';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import { snackbarActions } from 'material-ui-snackbar-redux';
import { useSnackbar } from 'notistack';
import React, { memo, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useFirestore } from 'react-redux-firebase';
import { useHistory, useParams } from 'react-router-dom';
import { getRandomTaskId, handleErrors } from '../../services';
import DailyStreak from '../../services/dailyStreak';
import { deleteTask } from '../../store';
import {
  addPointsWithSideEffects,
  Task,
  TaskHistory,
  useTypedSelector,
} from '../../store/index';
import {
  activeTaskSelector,
  authSelector,
  fetchedTaskSelector,
  firestoreStatusSelector,
  profileSelector,
  tasksDoneTodaySelector,
  tasksPerDaySelector,
  tasksSelector,
} from '../../store/selectors';
import TaskPage from './TaskPage';

const log = debug('TaskPageContainer');
const streakLog = log.extend('dailyStreak');

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
  const { enqueueSnackbar } = useSnackbar();

  let { taskId = '' } = useParams();
  const currentTaskId = get(
    useTypedSelector(activeTaskSelector),
    'id',
  );
  // TODO refactor
  if (taskId === 'active') {
    taskId = currentTaskId as string;
  }

  const isAppIntroMode = taskId === 'introExample';
  const [isRequested, setRequested] = useState(false);
  const firestoreStatus = useTypedSelector(firestoreStatusSelector);
  const profile = useTypedSelector(profileSelector);
  const auth = useTypedSelector(authSelector);
  const tasksPerDay = useTypedSelector(tasksPerDaySelector);
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

  async function activateNextTask() {
    return nextTaskId
      ? firestoreRedux.doc('tasks/' + nextTaskId).update({
          ...tasks.find(t => t.id === nextTaskId),
          isCurrent: true,
        })
      : Promise.resolve();
  }

  async function updateDailyStreak() {
    const now = Date.now();
    const streak = profile.dailyStreak;
    const isStreakBroken = DailyStreak.hasEnded(streak);
    const shouldStreakUpdate = DailyStreak.shouldUpdate({
      // NOTE: +1 because when this function is called task
      // update is not registred yet, thus task may look as it is nt done yet.
      tasksDoneToday: tasksDoneToday + 1,
      streak: profile.dailyStreak,
    });
    streakLog('streak: ', streak);
    streakLog('isStreakBroken: ', isStreakBroken);
    streakLog('shouldStreakUpdate: ', shouldStreakUpdate);

    if (shouldStreakUpdate) {
      streakLog('update is running');
      const payload = Object.assign({}, profile, {
        dailyStreak: {
          updatedAt: now,
          startsAt: isStreakBroken ? now : streak.startsAt,
          // TODO instead of writing this line, find a way to
          // properly merge deep properties.
          perDay: tasksPerDay,
        },
      });
      streakLog('payload: ', payload);
      return firestoreRedux
        .doc('profiles/' + auth.uid)
        .update(payload);
    }
  }

  async function deactivateActiveTasks() {
    return Promise.all(
      tasks
        .filter(i => i.isCurrent)
        .map(i =>
          firestoreRedux
            .doc('tasks/' + i.id)
            .update({ isCurrent: false } as Task),
        ),
    );
  }

  const mergedProps = {
    async updateTask({
      values,
      snackbarMessage,
      pointsToAdd = 10,
      history: historyToAdd,
    }: updateTaskParams) {
      log('updateTask is running.');
      try {
        enqueueSnackbar(snackbarMessage);
        history.push(nextTaskId ? '/tasks/' + nextTaskId : '/');

        await Promise.all([
          deactivateActiveTasks(),
          firestoreRedux.doc('tasks/' + taskId).update({
            ...task,
            ...values,
            // TODO make sure subcollections instead of array are
            // working properly and remove this line
            history: [...get(task, 'history', []), historyToAdd],
          }),
          firestoreRedux.collection('taskLogs').add({
            ...historyToAdd,
            taskId: taskId,
            userId: task.userId,
            createdAt: Date.now(),
          }),
          addPointsWithSideEffects(task.userId, pointsToAdd),
          activateNextTask(),
          updateDailyStreak(),
        ]);
      } catch (error) {
        handleErrors(error);
        if (error.message.includes('Null value error.')) {
          return history.push('/');
        }
        history.push('/tasks/active');
      }
    },
    async deleteTask(options: deleteTaskArguments = {}) {
      log('deleteTask is running.');
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
        history.push(nextTaskId ? '/tasks/active' : '/');
      } catch (error) {
        handleErrors(error);
        history.push(`/tasks/active`);
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
