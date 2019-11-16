import nanoid from 'nanoid';
import { firestore } from 'firebase/app';
import subtractDays from 'date-fns/subDays';

export interface ITask {
  name: string;
  isDone: boolean;
  doneAt?: number;
  dueAt: number;
  userId: string;
  note?: string;
  subtasks?: any[];
}

export function upsertTask(
  values: { name: string; userId?: string },
  taskId?: string,
): Promise<void | Error> {
  if (!taskId && !values.userId)
    return Promise.reject('You forgot to add userId');
  return firestore()
    .collection('tasks')
    .doc(taskId || nanoid())
    .set(
      taskId
        ? values
        : {
            ...values,
            isDone: false,
            dueAt: subtractDays(new Date(), 1).getTime(),
          },
      { merge: true },
    );
}

// TODO: is this function ever used? Remove it?
export function createTask(values: {
  name: string;
  userId: string;
}): Promise<firestore.DocumentReference> {
  return firestore()
    .collection('tasks')
    .add({
      ...values,
      isDone: false,
      dueAt: subtractDays(new Date(), 1).getTime(),
    });
}

export function deleteTask(taskId: string): Promise<void | Error> {
  return firestore()
    .doc('tasks/' + taskId)
    .delete();
}

export function createSubtask(
  taskId: string,
  values: {
    name: string;
  },
): Promise<void | Error> {
  return firestore()
    .doc('tasks/' + taskId)
    .update({
      subtasks: firestore.FieldValue.arrayUnion({
        id: nanoid(),
        isDone: false,
        parentId: taskId,
        createdAt: Date.now(),
        name: values.name.trim(),
      }),
    });
}

export interface SubtaskType {
  id: string;
  isDone: boolean;
  parentId: string;
  createdAt: number;
  name: string;
}

export async function updateSubtask(
  subtask: SubtaskType,
  values: {
    name?: string;
    doneAt: number;
    isDone: boolean;
  },
): Promise<void | Error> {
  const docRef = firestore().doc('tasks/' + subtask.parentId);
  const task: any = await docRef.get();
  const newSubtasks: any[] = task
    .data()
    .subtasks.map((i: SubtaskType) => {
      return i.id === subtask.id ? Object.assign({}, i, values) : i;
    });
  return docRef.update({
    subtasks: newSubtasks,
  });
}

export function deleteSubtask(
  taskId: string,
  subtask: {
    id: string;
  },
): Promise<void | Error> {
  return firestore()
    .doc('tasks/' + taskId)
    .update({
      subtasks: firestore.FieldValue.arrayRemove(subtask),
    });
}
