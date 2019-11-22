import { useDocumentData } from 'react-firebase-hooks/firestore';
import { useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router-dom';
import { calculateNextRepetition } from '../../services';
import { deleteTask, updateSubtask } from '../../store';
import { TasksContext } from '../../store/contexts';
import { Subtask, Task } from '../../store/index';
import React, { useContext, useState } from 'react';
import random from 'lodash/random';
import { useSnackbar as useMaterialSnackbar } from 'material-ui-snackbar-provider';
import { useSnackbar } from 'notistack';
import { firestore } from 'firebase/app';
import find from 'lodash/find';
import invoke from 'lodash/invoke';
import TaskPage from './TaskPage';
import get from 'lodash/get';

function filterCurrentTask(tasks: Task[]): Task[] {
  return tasks.filter(t => !t.isCurrent);
}

function getRandomTaskId(tasks: Task[]): Task[] {
  return get(tasks, `[${random(tasks.length - 1)}].id`);
}

export default () => {
  const [t] = useTranslation();
  const history = useHistory();
  const snackbar = useMaterialSnackbar();
  const { enqueueSnackbar } = useSnackbar();
  const [isRequested, setRequested] = useState();
  // TODO this needs to be a service
  const handleErrors = (e: Error) =>
    enqueueSnackbar(get(e, 'message') || t('Something went wrong'), {
      variant: 'error',
    });

  const { taskId } = useParams();
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
    filterCurrentTask(get<Task[]>(tasks, 'docs', [])),
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
      async function undoDelete() {
        const task = find(get(tasks, 'docs'), ['id', taskId]);
        // @ts-ignore
        await taskPointer.set(task.data());
        history.push(`/tasks/${taskId}`);
      }

      history.push('/');
      if (taskId)
        try {
          await deleteTask(taskId);
          await snackbar.showMessage(
            t('successfullyDeleted'),
            t('undo'),
            undoDelete,
          );
        } catch (error) {
          handleErrors(error);
          history.push(`/tasks/${taskId}`);
        }
    },
    updateTask(values: object, message: string, variant?: 'success') {
      setRequested(true);
      return taskPointer
        .update(values)
        .then(() => {
          // @ts-ignore
          if (message) enqueueSnackbar(message, { variant });
          history.push(`/${nextTaskId || ''}`);
        })
        .catch(e => handleErrors(e));
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
};
