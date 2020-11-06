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
    const isTaskOld =
      differenceInDays(task?.createdAt || today, today) > 3;
    const isTaskUpdatedLongAgo =
      differenceInDays(task?.updatedAt || today, today) > 3;
    const result =
      (isTaskOld && isEmpty(task.history)) ||
      isTaskUpdatedLongAgo ||
      // NOTE: At first i didn't have "createdAt" property.
      // TODO: remove this line in the future.
      task?.createdAt === undefined;

    log('isStale is called. %O', task);
    log('isTaskOld: ', isTaskOld);
    log('isTaskUpdatedLongAgo: ', isTaskUpdatedLongAgo);
    log('result: ', result);

    return result;
  }
}
