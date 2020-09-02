import debug from 'debug';
import filter from 'lodash/filter';
import find from 'lodash/find';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import { snackbarActions } from 'material-ui-snackbar-redux';
import { useSnackbar } from 'notistack';
import React, { memo, useEffect, useState as useToggle } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useFirestore } from 'react-redux-firebase';
import { useHistory, useParams } from 'react-router-dom';
import { getRandomTaskId, handleErrors } from '../../services';
import DailyStreak from '../../services/dailyStreak';
import { deleteTask, Task } from '../../store';
import {
  addPointsWithSideEffects,
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
  tasksSelector,
} from '../../store/selectors';
import TaskPage from './TaskPage';
import { TaskPageProps } from './TaskPage';
import { uiSelector } from '../../store/selectors';
import { toggleTasksDoneTodayNotification } from '../../store/uiSlice';
import { upsertProfile, upsertTask } from '../../store/index';
import TaskService from '../../services/TaskService';

const componentName = 'TaskPageContainer';
const log = debug(componentName);

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

const Container = memo(() => {
  // States.
  const [isLoading, toggleLoading] = useToggle(false);
  // Services.
  const [t] = useTranslation();
  const history = useHistory();
  const dispatch = useDispatch();
  const firestoreRedux = useFirestore();
  const { enqueueSnackbar } = useSnackbar();
  // Data.
  let { taskId = '' } = useParams();
  const tasks = useTypedSelector(tasksSelector) || [];
  const currentTaskId = get(
    useTypedSelector(activeTaskSelector),
    'id',
  );
  const nextTaskId = getRandomTaskId(
    filter(tasks, t => t.id !== taskId),
  );
  const { uid: userId } = useTypedSelector(authSelector);
  const uiState = useTypedSelector(uiSelector);
  const firestoreStatus = useTypedSelector(firestoreStatusSelector);
  const profile = useTypedSelector(profileSelector);
  const tasksDoneToday = useTypedSelector(tasksDoneTodaySelector);
  const fetchedTask = useTypedSelector(fetchedTaskSelector);

  function goHome() {
    return history.push('/');
  }

  // If url is '/active' take taskId from active task.
  if (taskId === 'active') {
    taskId = currentTaskId as string;
  }
  let task = find(tasks, ['id', taskId]) || fetchedTask;

  // Fetch task if needed.
  useEffect(() => {
    if (
      get(firestoreStatus, 'requested.activeTasks') &&
      get(task, 'id') !== taskId &&
      !isLoading
    ) {
      log('Task fetching in progress.');
      toggleLoading(true);
      firestoreRedux
        .get({
          doc: taskId,
          collection: 'tasks',
          storeAs: 'currentTask',
        })
        .then(() => toggleLoading(false))
        .catch(error => {
          handleErrors(error);
          goHome();
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [task, isLoading, firestoreStatus, taskId]);

  async function updateDailyStreak() {
    return upsertProfile({
      ...profile,
      userId,
      dailyStreak: DailyStreak.getUpdatedStreak({
        streak: profile.dailyStreak,
        // NOTE: +1 because when this function is called task
        // update is not registred yet, thus task may look as it is nt done yet.
        tasksDoneToday: tasksDoneToday + 1,
      }),
    });
  }

  function showSnackbarAfterTaskDelete({
    deletedTask,
    pointsToRemoveFromUser,
    message,
  }: {
    deletedTask: Task;
    message: string;
    pointsToRemoveFromUser: number;
  }) {
    async function undoTaskDeletion() {
      await Promise.all([
        upsertTask(deletedTask, deletedTask.id),
        addPointsWithSideEffects(
          deletedTask.userId,
          pointsToRemoveFromUser * -1,
        ),
      ]);
      history.push(`/tasks/${deletedTask.id}`);
    }

    dispatch(
      snackbarActions.show({
        message,
        action: t('undo'),
        handleAction: () => undoTaskDeletion(),
      }),
    );
  }

  const mergedProps = {
    taskId,
    task: task || {},
    loading: isEmpty(task) || isLoading,
    shouldDisplayEncouragements: !profile.areEcouragingMessagesDisabled,
    async updateTask({
      values,
      snackbarMessage,
      pointsToAdd = 10,
      history: historyToAdd,
    }: updateTaskParams) {
      log('updateTask is running.');
      try {
        history.push(nextTaskId ? '/tasks/' + nextTaskId : '/');

        dispatch(toggleTasksDoneTodayNotification());
        setTimeout(() => {
          dispatch(toggleTasksDoneTodayNotification());
          enqueueSnackbar(snackbarMessage);
        }, 2500);

        await Promise.all([
          TaskService.deactivateActiveTasks(tasks),
          upsertTask(
            {
              ...task,
              ...values,
              history: [...get(task, 'history', []), historyToAdd],
            },
            task.id,
          ),
          firestoreRedux.collection('taskLogs').add({
            ...historyToAdd,
            taskId,
            userId,
            createdAt: Date.now(),
          }),
          addPointsWithSideEffects(userId, pointsToAdd),
          TaskService.activateNextTask({
            nextTaskId,
            currentTasks: tasks,
          }),
          updateDailyStreak(),
        ]);
      } catch (error) {
        handleErrors(error);
        if (error.message.includes('Null value error.')) {
          return goHome();
        }
        history.push('/tasks/active');
      }
    },
    async deleteTask(options: deleteTaskArguments = {}) {
      log('deleteTask is running.');
      toggleLoading(true);
      try {
        await Promise.all([
          deleteTask(taskId),
          addPointsWithSideEffects(userId, 10),
          TaskService.activateNextTask({
            nextTaskId,
            currentTasks: tasks,
          }),
        ]);
        showSnackbarAfterTaskDelete({
          deletedTask: task,
          pointsToRemoveFromUser: options.pointsToAdd || 10,
          message:
            options.snackbarMessage || t('successfullyDeleted'),
        });
        history.push(nextTaskId ? '/tasks/active' : '/');
      } catch (error) {
        handleErrors(error);
        history.push(`/tasks/active`);
      } finally {
        toggleLoading(false);
      }
    },
    tasksDoneTodayNotificationProps: {
      isLoaded: true,
      tasksToday: tasksDoneToday,
      dailyStreak: profile.dailyStreak,
      tasksPerDay: profile.dailyStreak.perDay,
      toggleVisibility: toggleTasksDoneTodayNotification,
      isVisible: uiState.isTasksDoneTodayNotificationOpen,
    },
  } as TaskPageProps;
  return <TaskPage {...mergedProps} />;
});

export default Container;
