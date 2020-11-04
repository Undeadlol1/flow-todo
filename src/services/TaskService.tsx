import { isEmpty } from 'lodash';
import find from 'lodash/find';
import get from 'lodash/fp/get';
import { Task } from '../store';
import { getFirestore } from './index';

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
    return isEmpty(task.history);
  }
}
