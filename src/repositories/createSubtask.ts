import firebase from 'firebase/app';
import { getFirestore as getFirestore2 } from 'redux-firestore';
import { getUniqueId } from '../helpers/getUniqueId';

const { FieldValue } = firebase.firestore;

// NOTE: WIP
export function createSubtask(
  taskId: string,
  values: {
    name: string;
  },
): Promise<void | Error> {
  console.log('taskId: ', taskId);
  return (
    // @ts-ignore
    getFirestore2(firebase)
      // return getFirestore()
      .update(
        { collection: 'tasks', doc: taskId },
        {
          // TODO: this might be the reason of "id" dissapearing from Task
          // TODO: Use firestore from from redux-firestore
          subtasks: FieldValue.arrayUnion({
            // TODO: this might be the reason of "id" dissapearing from Task
            id: getUniqueId(),
            isDone: false,
            parentId: taskId,
            createdAt: Date.now(),
            name: values.name.trim(),
          }),
        },
      )
  );
}
