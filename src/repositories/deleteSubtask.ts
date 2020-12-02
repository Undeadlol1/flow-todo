import firebase from 'firebase/app';
import { getFirestore } from '../services/index';
import { Subtask } from '../entities/Subtask';

export function deleteSubtask(
  subtask: Subtask,
): Promise<void | Error> {
  return getFirestore()
    .doc('tasks/' + subtask.parentId)
    .update({
      subtasks: firebase.firestore.FieldValue.arrayRemove(subtask),
    });
}
