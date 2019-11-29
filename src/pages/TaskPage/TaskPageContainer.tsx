import { firestore } from 'firebase/app';
import get from 'lodash/get';
import once from 'lodash/once';
import random from 'lodash/random';
import { snackbarActions } from 'material-ui-snackbar-redux';
import { useSnackbar } from 'notistack';
import React, { memo, useState } from 'react';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import {
  calculateNextRepetition,
  handleErrors,
} from '../../services';
import { deleteTask, updateSubtask } from '../../store';
import {
  addPoints,
  Subtask,
  Task,
  useTypedSelector,
} from '../../store/index';
import TaskPage from './TaskPage';

function getRandomTaskId(tasks: Task[]): string {
  return get(tasks, `[${random(tasks.length - 1)}].id`);
}

export default memo(() => {
  const [t] = useTranslation();
  const history = useHistory();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const [isRequested, setRequested] = useState();

  const { taskId = '' } = useParams();
  const isAppIntroMode = taskId === 'introExample';
  const activeTasks =
    useTypedSelector<Task[]>(
      ({ firestore }) => firestore.ordered.activeTasks,
    ) || [];
  const { requested } = useTypedSelector(
    ({ firestore }) => firestore.status,
  );
  const currentTask = activeTasks.find(t => t.isCurrent);
  const nextTaskId = getRandomTaskId(
    activeTasks.filter((t: any) => !t.isCurrent),
  );

  if (
    get(requested, 'activeTasks') &&
    get(currentTask, 'id') !== taskId
  ) {
    // TODO: load task data
    // return;
  }
  const taskPointer = firestore().doc('tasks/' + taskId);
  let [task, taskLoading, taskError] = useDocumentData(
    // @ts-ignore
    !isAppIntroMode || !currentTask ? taskPointer : undefined,
  );

  if (taskError) once(() => handleErrors(taskError));

  if (isAppIntroMode) {
    task = {
      name: t('exampleTask'),
    };
  }

  const mergedProps = {
    async deleteTask() {
      history.push('/');
      try {
        await Promise.all([
          deleteTask(taskId),
          addPoints(task.userId, 10),
        ]);
        dispatch(
          snackbarActions.showMessage(
            t('successfullyDeleted'),
            t('undo'),
            async function restoreTaskAndRedirect() {
              // @ts-ignore
              await taskPointer.set(task.data());
              history.push(`/tasks/${taskId}`);
            },
          ),
        );
      } catch (error) {
        handleErrors(error);
        history.push(`/tasks/${taskId}`);
      }
    },
    async updateTask(
      values: object,
      message: string,
      variant = 'success',
      pointsToAdd = 10,
    ) {
      setRequested(true);
      try {
        await Promise.all([
          taskPointer.update(values),
          addPoints(task.userId, pointsToAdd),
        ]);
        await firestore()
          .doc('tasks/' + nextTaskId)
          .update({ isCurrent: true });
        // @ts-ignore
        if (message) enqueueSnackbar(message, { variant });
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
    updateSubtask(subtask: Subtask) {
      setRequested(true);
      return updateSubtask(subtask, {
        isDone: true,
        doneAt: Date.now(),
      })
        .then(() => {
          this.updateTask(
            {
              isCurrent: false,
              ...calculateNextRepetition(task, 'good'),
            },
            t('Good job!'),
          );
        })
        .catch((e: Error) => handleErrors(e));
    },
    task: task || {},
    loading: taskLoading || isRequested,
    taskId,
    isAppIntroMode,
  };
  // TODO: remoove @ts-ignore
  // @ts-ignore
  return <TaskPage {...mergedProps} />;
});
