import { TaskHistory } from '../entities/TaskHistory';
import { getFirestore } from '../services';

export async function createTaskHistory(payload: {
  history: TaskHistory;
  taskId: string;
  userId: string;
}) {
  return getFirestore()
    .collection('taskLogs')
    .add({
      ...payload.history,
      taskId: payload.taskId,
      userId: payload.userId,
      createdAt: Date.now(),
    });
}
