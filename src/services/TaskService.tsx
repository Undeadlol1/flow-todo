import differenceInDays from 'date-fns/esm/differenceInDays';
import { isEmpty } from 'lodash';
import find from 'lodash/find';
import get from 'lodash/fp/get';
import { Task } from '../entities/Task';
import { getFirestore } from './index';
import debug from 'debug';

const log = debug('TaskService');

export default class TaskService {
  static get db() {
    return getFirestore();
  }

  static async deactivateActiveTasks(tasks: Task[] = []) {
    return Promise.all(
      tasks
        .filter(get('isCurrent'))
        .map(({ id }) =>
          this.db
            .doc(`tasks/${id}`)
            .update({ isCurrent: false } as Task),
        ),
    );
  }

  static async activateNextTask({
    nextTaskId = '',
    currentTasks = [],
  }: {
    nextTaskId: string;
    currentTasks: Task[];
  }) {
    return nextTaskId
      ? this.db.doc(`tasks/${nextTaskId}`).update({
          ...find(currentTasks, { id: nextTaskId }),
          isCurrent: true,
        })
      : Promise.resolve();
  }

  static isStale(task: Task): boolean {
    const today = Date.now();
    const isTaskCreatedLongAgo =
      differenceInDays(today, task.createdAt || today) > 3;
    const isTaskReadyButNotWorkedOn =
      differenceInDays(today, task.dueAt) > 3;

    log('isStale is called. %O', task);
    log('isTaskOld: ', isTaskCreatedLongAgo);

    function notifyThatTaskIsTale(reason: string) {
      log(reason);
      log('Task is stale.');
    }

    if (task?.createdAt === undefined) {
      notifyThatTaskIsTale('task.createdAt is undefined.');
      return true;
    }
    if (isTaskCreatedLongAgo && isEmpty(task.history)) {
      notifyThatTaskIsTale(
        'Task created long ago, but has no history. It is stale.',
      );
      return true;
    }
    if (isTaskReadyButNotWorkedOn) {
      notifyThatTaskIsTale('Task has been due for a while.');
      return true;
    }
    log('Task is not stale.');
    return false;
  }
}
