import { last, isEmpty } from 'lodash';
import { Task } from '../store';
import { getFirestore } from './index';

export default class TaskService {
  static async deactivateActiveTasks(tasks: Task[] = []) {
    return Promise.all(
      tasks
        .filter((i) => i.isCurrent)
        .map(({ id }) =>
          getFirestore()
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
      ? getFirestore()
          .doc(`tasks/${nextTaskId}`)
          .update({
            ...currentTasks.find(({ id }) => id === nextTaskId),
            isCurrent: true,
          })
      : Promise.resolve();
  }

  static isStale(task: Task): boolean {
    return isEmpty(task.history);
  }
}
