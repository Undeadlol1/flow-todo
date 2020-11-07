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

  // TOOD dueAt>updatedAt ===3
  static isStale(task: Task): boolean {
    const today = Date.now();
    const isTaskCreatedLongAgo =
      differenceInDays(task?.createdAt || today, today) > 3;
    const isTaskUpdatedLongAgo =
      differenceInDays(task?.updatedAt || today, today) > 3;
    const isTaskReadyButNotWorkedOn =
      differenceInDays(task.dueAt, today) > 3;

    log('isStale is called. %O', task);
    log('isTaskOld: ', isTaskCreatedLongAgo);
    log('isTaskUpdatedLongAgo: ', isTaskUpdatedLongAgo);

    // NOTE: At first i didn't have "createdAt" property.
    // TODO: remove this line in the future.
    if (task?.createdAt === undefined) {
      log('task.createdAt is undefined. Task is considered stale.');
      return true;
    }
    if (isTaskReadyButNotWorkedOn) {
      log('Task is due but not worked on. It is stale.');
      return true;
    }
    // TODO:
    if (isTaskCreatedLongAgo && isEmpty(task.history)) {
      log('Task created long ago, but has no history. It is stale.');
      return true;
    }
    if (task.updatedAt !== undefined && isTaskUpdatedLongAgo) {
      return true;
    }
    return false;
  }
}
