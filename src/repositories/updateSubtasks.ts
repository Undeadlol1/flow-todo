import { Subtask } from '../entities/Subtask';
import { updateTask } from './updateTask';

export async function updateSubtasks({
  taskId,
  subtasks = [],
}: {
  taskId: string;
  subtasks: Subtask[];
}) {
  return updateTask({
    subtasks,
    id: taskId,
  });
}
