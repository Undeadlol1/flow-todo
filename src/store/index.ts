import nanoid from 'nanoid';
import { firestore } from 'firebase/app';

export function createSubtask(taskId: string, values: {
        name: string,
    }) : Promise<void | Error> {
    return firestore()
        .doc('tasks/'+taskId)
        .update({
            subtasks: firestore.FieldValue.arrayUnion({
                id: nanoid(),
                isDone: false,
                createdAt: Date.now(),
                name: values.name.trim(),
            }),
        })
}

export default '';