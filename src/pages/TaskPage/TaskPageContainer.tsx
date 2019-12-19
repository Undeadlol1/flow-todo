import get from 'lodash/get';
import isUndefined from 'lodash/isUndefined';
import random from 'lodash/random';
import { snackbarActions } from 'material-ui-snackbar-redux';
import { OptionsObject, useSnackbar } from 'notistack';
import React, { memo, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useFirestore } from 'react-redux-firebase';
import { useHistory, useParams } from 'react-router-dom';
import {
  calculateNextRepetition,
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
  activeTasksSelector,
  currentTaskSelector,
} from '../../store/selectors';
import TaskPage from './TaskPage';
import { activeTaskSelector } from '../../store/selectors';

export function getRandomTaskId(tasks: Task[]): string {
  return get(tasks, `[${random(tasks.length - 1)}].id`);
}

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
  const [isRequested, setRequested] = useState();

  const { taskId = '' } = useParams();
  const isAppIntroMode = taskId === 'introExample';
  const activeTasks = useTypedSelector(activeTasksSelector) || [];
  const { requested } = useTypedSelector(
    ({ firestore }) => firestore.status,
  );
  let currentTask = useTypedSelector(activeTaskSelector);
  const nextTaskId = getRandomTaskId(
    activeTasks.filter((t: any) => !t.isCurrent),
  );

  useEffect(() => {
    if (
      !isAppIntroMode &&
      get(requested, 'activeTasks') &&
      get(currentTask, 'id') !== taskId
    ) {
      setRequested(true);
      firestoreRedux
        .get({
          doc: taskId,
          collection: 'tasks',
          storeAs: 'currentTask',
        })
        .then(() => setRequested(false))
        .catch(handleErrors);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTask, requested, isAppIntroMode, taskId]);

  const taskPointer = firestoreRedux.doc('tasks/' + nextTaskId);
  let task = useTypedSelector(currentTaskSelector);

  // @ts-ignore
  if (get(currentTask, 'id') === taskId) task = currentTask;
  // TODO find out how to get errors from redux-firestore
  // if (taskError) once(() => handleErrors(taskError))();

  if (isAppIntroMode) {
    task = {
      name: t('exampleTask'),
    } as Task;
  }

  const mergedProps = {
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
                taskPointer.set(task),
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
    async updateTask({
      values,
      snackbarMessage,
      pointsToAdd = 10,
      history: historyToAdd,
      snackbarVariant = 'success',
    }: updateTaskParams) {
      try {
        setRequested(true);

        await Promise.all([
          await firestoreRedux.doc('tasks/' + taskId).update({
            ...task,
            ...values,
            history: [...get(task, 'history', []), historyToAdd],
          }),
          await addPointsWithSideEffects(task.userId, pointsToAdd),
          nextTaskId
            ? await firestoreRedux.doc('tasks/' + nextTaskId).update({
                ...activeTasks.find(t => t.id === nextTaskId),
                isCurrent: true,
              })
            : Promise.resolve(),
        ]);

        if (snackbarMessage)
          enqueueSnackbar(snackbarMessage, {
            variant: snackbarVariant,
          });
        history.push(nextTaskId ? '/tasks/' + nextTaskId : '/');
      } catch (error) {
        if (error.message.includes('Null value error.')) {
          history.push('/');
        }
        handleErrors(error);
        history.push('/tasks/' + taskId);
      } finally {
        setRequested(false);
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
    task: task || {},
    loading: isUndefined(currentTask) || isRequested,
    taskId,
    isAppIntroMode,
  };
  return <TaskPage {...mergedProps} />;
});
