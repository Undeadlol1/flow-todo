import debug from 'debug';
import filter from 'lodash/filter';
import find from 'lodash/find';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import React, { memo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useFirestore } from 'react-redux-firebase';
import { useHistory, useParams } from 'react-router-dom';
import useToggle from 'react-use/lib/useToggle';
import { ViewerController } from '../../controllers/ViewerController';
import { TaskHistory } from '../../entities/TaskHistory';
import { deleteTask as deleteTaskRepo } from '../../repositories/deleteTask';
import { upsertProfile } from '../../repositories/upsertProfile';
import { upsertTask } from '../../repositories/upsertTask';
import { handleErrors } from '../../services';
import DailyStreak from '../../services/dailyStreak';
import Snackbar from '../../services/Snackbar';
import TaskService from '../../services/TaskService';
import { useTypedSelector } from '../../store/index';
import {
  activeTaskSelector,
  authSelector,
  fetchedTaskSelector,
  firestoreStatusSelector,
  profileSelector,
  tasksDoneTodaySelector,
  tasksSelector,
  uiSelector,
} from '../../store/selectors';
import { toggleTasksDoneTodayNotification } from '../../store/uiSlice';
import TaskPage, { TaskPageProps } from './TaskPage';

const componentName = 'TaskPageContainer';
const log = debug(componentName);

export interface updateTaskParams {
  values: any;
  pointsToAdd?: number;
  history: TaskHistory;
  snackbarMessage?: string;
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
  const firestoreRedux = useFirestore();
  // Data.
  // @ts-ignore
  let { taskId = '' } = useParams();
  const tasks = useTypedSelector(tasksSelector) || [];
  const currentTaskId = get(
    useTypedSelector(activeTaskSelector),
    'id',
  );
  const nextTaskId = TaskService.getRandomTaskId(
    filter(tasks, (t) => t.id !== taskId),
  );
  const uiState = useTypedSelector(uiSelector);
  const profile = useTypedSelector(profileSelector);
  const { uid: userId } = useTypedSelector(authSelector);
  const fetchedTask = useTypedSelector(fetchedTaskSelector);
  const tasksDoneToday = useTypedSelector(tasksDoneTodaySelector);
  const firestoreStatus = useTypedSelector(firestoreStatusSelector);

  function goHome() {
    return history.replace('/');
  }

  // If url is '/active' take taskId from active task.
  if (taskId === 'active') {
    taskId = currentTaskId as string;
  }
  const task = find(tasks, ['id', taskId]) || fetchedTask;

  log('task: ', task);
  log('isStale?', TaskService.isStale(task));

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
        .then(toggleLoading)
        .catch((error) => {
          handleErrors(error);
          goHome();
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [task, isLoading, firestoreStatus, taskId]);

  async function updateTask({
    values,
    snackbarMessage,
    pointsToAdd = 10,
    history: historyToAdd,
  }: updateTaskParams) {
    log('updateTask is running.');
    try {
      history.replace(nextTaskId ? `/tasks/${nextTaskId}` : '/');

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
        ViewerController.rewardUserForWorkingOnATask({
          points: pointsToAdd,
          snackbarMessage,
        }),
        TaskService.activateNextTask({
          nextTaskId,
          currentTasks: tasks,
        }),
        updateDailyStreak(),
      ]);
    } catch (error) {
      handleErrors(error);
      if (error.message.includes('Null value error.')) {
        goHome();
        return;
      }
      history.replace('/tasks/active');
    }
  }

  async function deleteTask(options: deleteTaskArguments = {}) {
    log('deleteTask is running.');
    toggleLoading(true);
    return Promise.all([
      deleteTaskRepo(taskId),
      ViewerController.rewardUserWithPoints(10),
      TaskService.activateNextTask({
        nextTaskId,
        currentTasks: tasks,
      }),
    ])
      .then(() => {
        Snackbar.addToQueue(
          options.snackbarMessage || t('successfullyDeleted'),
        );
        history.replace(nextTaskId ? '/tasks/active' : '/');
      })
      .catch((error) => {
        handleErrors(error);
        history.replace('/tasks/active');
      })
      .finally(toggleLoading);
  }

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

  const mergedProps = {
    taskId,
    updateTask,
    deleteTask,
    task: task || {},
    loading: isEmpty(task) || isLoading,
    shouldDisplayEncouragements: !profile.areEcouragingMessagesDisabled,
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
