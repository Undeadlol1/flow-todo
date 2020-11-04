import { getFirestore } from '../services/index';

export function deleteTask(taskId: string): Promise<void | Error> {
  return getFirestore()
    .doc('tasks/' + taskId)
    .delete();
}
