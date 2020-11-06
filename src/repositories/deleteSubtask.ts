import firebase from 'firebase/app';
import { getFirestore } from '../services/index';

export function deleteSubtask(
  taskId: string,
  subtask: {
    id: string;
  },
): Promise<void | Error> {
  return getFirestore()
    .doc('tasks/' + taskId)
    .update({
      subtasks: firebase.firestore.FieldValue.arrayRemove(subtask),
    });
}
