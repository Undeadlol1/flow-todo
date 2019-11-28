import { useDocumentData } from 'react-firebase-hooks/firestore';
import { useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router-dom';
import {
  calculateNextRepetition,
  handleErrors,
} from '../../services';
import { deleteTask, updateSubtask } from '../../store';
import { TasksContext } from '../../store/contexts';
import { Subtask, Task, addPoints } from '../../store/index';
import React, { useContext, useState, memo } from 'react';
// import random from 'lodash/random';
import { useSnackbar } from 'notistack';
import { firestore } from 'firebase/app';
import find from 'lodash/find';
import invoke from 'lodash/invoke';
import TaskPage from './TaskPage';
import get from 'lodash/get';
import { useDispatch } from 'react-redux';
import { snackbarActions } from 'material-ui-snackbar-redux';
import random from 'lodash/random';

function getRandomTaskId(tasks: Task[]): string {
  return get(tasks, `[${random(tasks.length - 1)}].id`);
}

export default memo(() => {
  const [t] = useTranslation();
  const history = useHistory();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const [isRequested, setRequested] = useState();
  // TODO this needs to be a service

  const { taskId = '' } = useParams();
  const isAppIntroMode = taskId === 'introExample';
  const taskPointer = firestore()
    .collection('tasks')
    .doc(taskId);
  const { tasks } = useContext(TasksContext);

  // TODO: this is a mess. Rework this
  const currentTask = invoke(
    // @ts-ignore
    get<Task[]>(tasks, 'docs', []).find((t: Task) =>
      // @ts-ignore
      t.get('isCurrent'),
    ),
    'data',
  );
  const nextTaskId = getRandomTaskId(
    // @ts-ignore
    get(tasks, 'docs', []).filter((t: any) => !t.isCurrent),
  );

  let [task, taskLoading, taskError] = useDocumentData(
    // @ts-ignore
    !isAppIntroMode || !currentTask ? taskPointer : undefined,
  );

  if (taskError) handleErrors(taskError);

  if (isAppIntroMode) {
    task = {
      name: t('exampleTask'),
    };
  }

  const mergedProps = {
    async deleteTask() {
      history.push('/');
      try {
        const task = find(get(tasks, 'docs'), ['id', taskId]);
        await Promise.all([
          deleteTask(taskId),
          addPoints(task!.get('userId'), 10),
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
          firestore()
            .doc('tasks/' + nextTaskId)
            .update({ isCurrent: true }),
        ]);
        // @ts-ignore
        if (message) enqueueSnackbar(message, { variant });
        history.push(nextTaskId ? '/tasks/' + nextTaskId : '/');
      } catch (error) {
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
