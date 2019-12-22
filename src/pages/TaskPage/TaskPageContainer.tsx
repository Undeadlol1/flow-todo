import debug from 'debug';
import filter from 'lodash/filter';
import find from 'lodash/find';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import { snackbarActions } from 'material-ui-snackbar-redux';
import { OptionsObject, useSnackbar } from 'notistack';
import React, { memo, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useFirestore } from 'react-redux-firebase';
import { useHistory, useParams } from 'react-router-dom';
import {
  calculateNextRepetition,
  getRandomTaskId,
  handleErrors,
} from '../../services';
import { deleteTask, updateSubtask } from '../../store';
import {
  addPointsWithSideEffects,
  Subtask,
  Task,
  TaskHistory,
  useTypedSelector,
} from '../../store/index';
import {
  fetchedTaskSelector,
  firestoreStatusSelector,
  tasksSelector,
} from '../../store/selectors';
import TaskPage from './TaskPage';

const log = debug('TaskPageContainer');

export interface updateTaskParams {
  values: any;
  pointsToAdd?: number;
  snackbarMessage: string;
  snackbarVariant?: OptionsObject['variant'];
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

  const { taskId = '' } = useParams();
  const isAppIntroMode = taskId === 'introExample';
  const [isRequested, setRequested] = useState(false);
  const firestoreStatus = useTypedSelector(firestoreStatusSelector);

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

  const nextTaskId = getRandomTaskId(filter(tasks, ['id', taskId]));
  const mergedProps = {
    async updateTask({
      values,
      snackbarMessage,
      pointsToAdd = 10,
      history: historyToAdd,
      snackbarVariant = 'success',
    }: updateTaskParams) {
      try {
        history.push(nextTaskId ? '/tasks/' + nextTaskId : '/');

        if (snackbarMessage)
          enqueueSnackbar(snackbarMessage, {
            variant: snackbarVariant,
          });

        await Promise.all([
          await firestoreRedux.doc('tasks/' + taskId).update({
            ...task,
            ...values,
            history: [...get(task, 'history', []), historyToAdd],
          }),
          await addPointsWithSideEffects(task.userId, pointsToAdd),
          nextTaskId
            ? await firestoreRedux.doc('tasks/' + nextTaskId).update({
                ...tasks.find(t => t.id === nextTaskId),
                isCurrent: true,
              })
            : Promise.resolve(),
        ]);
      } catch (error) {
        handleErrors(error);
        if (error.message.includes('Null value error.')) {
          history.push('/');
        }
        history.push('/tasks/' + taskId);
      }
    },
    async updateSubtask(subtask: Subtask) {
      setRequested(true);
      try {
        await Promise.all([
          updateSubtask(subtask, {
            isDone: true,
            doneAt: Date.now(),
          }),
          this.updateTask({
            values: {
              isCurrent: false,
              ...calculateNextRepetition(task, 'good'),
            },
            history: {
              createdAt: Date.now(),
              actionType: 'updateSubtask',
            },
            snackbarMessage: t('Good job!'),
          }),
        ]);
      } catch (e) {
        return handleErrors(e);
      }
    },
    async deleteTask(options: deleteTaskArguments = {}) {
      setRequested(true);
      try {
        await Promise.all([
          deleteTask(taskId),
          addPointsWithSideEffects(task.userId, 10),
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
