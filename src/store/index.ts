import nanoid from 'nanoid';
import { firestore } from 'firebase/app';

export function createSubtask(taskId: string, values: {
    name: string,
}): Promise<void | Error> {
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
        })
}

interface SubtaskType {
    id: string,
    isDone: boolean,
    parentId: string,
    createdAt: string,
    name: string,
}

export async function updateSubtask(subtask: SubtaskType, values: {
    name: string,
    doneAt: string,
    isDone: boolean,
}, ): Promise<void | Error> {
    const docRef = firestore().doc('tasks/' + subtask.parentId)
    const task: any = await docRef.get()
    const newSubtasks: any[] = task.data()
        .subtasks
        .map((i: SubtaskType) => {
            return i.id === subtask.id
                ? Object.assign({}, i, values)
                : i
        })
    return docRef.update({
        subtasks: newSubtasks
    })
}

export function deleteSubtask(taskId: string, subtask: {
    id: string,
}): Promise<void | Error> {
    return firestore()
        .doc('tasks/' + taskId)
        .update({
            subtasks: firestore.FieldValue.arrayRemove(subtask),
        })
}
