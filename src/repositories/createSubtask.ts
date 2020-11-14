import firebase from 'firebase/app';
import { getFirestore } from 'redux-firestore';
import { getUniqueId } from '../helpers/getUniqueId';

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
  };
  return (
    // @ts-ignore
    getFirestore(firebase).update(
      { collection: 'tasks', doc: taskId },
      {
        subtasks: firebase.firestore.FieldValue.arrayUnion(subtask),
      },
    )
  );
}
