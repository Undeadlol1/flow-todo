import nanoid from 'nanoid';
import { firestore } from 'firebase/app';
import updateWith from 'lodash/updateWith'
import extend from 'lodash/extend'

export function createSubtask(taskId: string, values: {
        name: string,
    }) : Promise<void | Error> {
    return firestore()
        .doc('tasks/'+ taskId)
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

export function updateSubtask(subtask: SubtaskType, values: {
        name: string,
        doneAt: string,
        isDone: boolean,
    },) : Promise<void | Error> {
    const docRef = firestore().doc('tasks/' + subtask.parentId)
    return docRef
        .get()
        .then((task: any) : Promise <void | Error>  => {
            const {subtasks} = task.data()
            const newSubtask: any = extend(subtask, values)
            const newSubtasks: any[] = subtasks.map((i: SubtaskType) => {
                if (i.id === subtask.id) {
                   return Object.assign({}, subtask, values)
                }
            })
            return docRef.update({
                subtasks: newSubtasks
        })
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
