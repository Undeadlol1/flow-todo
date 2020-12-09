import { TaskHistory } from '../entities/TaskHistory';
import { getFirestore } from '../services/index';

export async function createTaskLog(historyToAdd: TaskHistory) {
  return getFirestore()
    .collection('taskLogs')
    .add({
      ...historyToAdd,
      createdAt: Date.now(),
    });
}
