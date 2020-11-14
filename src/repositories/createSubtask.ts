import firebase from 'firebase/app';
import { Subtask } from '../entities/Subtask';
import { getUniqueId } from '../helpers/getUniqueId';
import { updateTask } from './updateTask';

export function createSubtask(
  taskId: string,
  values: {
    name: string;
  },
): Promise<void | Error> {
  const subtask = {
    isDone: false,
    parentId: taskId,
    id: getUniqueId(),
    createdAt: Date.now(),
    name: values.name.trim(),
  } as Subtask;

  return updateTask({
    id: taskId,
    // @ts-ignore
    subtasks: firebase.firestore.FieldValue.arrayUnion(subtask),
  });
}
