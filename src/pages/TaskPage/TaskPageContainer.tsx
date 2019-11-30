import { firestore } from 'firebase/app';
import get from 'lodash/get';
import once from 'lodash/once';
import random from 'lodash/random';
import { snackbarActions } from 'material-ui-snackbar-redux';
import { useSnackbar, OptionsObject } from 'notistack';
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
          snackbarActions.show({
            message: t('successfullyDeleted'),
            action: t('undo'),
            async handleAction() {
              await Promise.all([
                // @ts-ignore
                taskPointer.set(task),
                addPoints(task.userId, -10),
              ]);
              history.push(`/tasks/${taskId}`);
            },
          }),
        );
      } catch (error) {
        handleErrors(error);
        history.push(`/tasks/${taskId}`);
      }
    },
    async updateTask({
      values,
      snackbarMessage,
      pointsToAdd = 10,
      snackbarVariant = 'success',
    }: {
      values: any;
      pointsToAdd?: number;
      snackbarMessage: string;
      snackbarVariant?: OptionsObject['variant'];
    }) {
      try {
        setRequested(true);
        await Promise.all([
          taskPointer.update(values),
          addPoints(task.userId, pointsToAdd),
        ]);
        if (nextTaskId)
          await firestore()
            .doc('tasks/' + nextTaskId)
            .update({ isCurrent: true });
        // @ts-ignore
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
            snackbarMessage: t('Good job!'),
          }),
        ]);
      } catch (e) {
        return handleErrors(e);
      }
    },
    task: task || {},
    loading: taskLoading || isRequested,
    taskId,
    isAppIntroMode,
  };
  return <TaskPage {...mergedProps} />;
});
