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
    return firestore()
        .doc('tasks/'+ subtask.parentId)
        .get()
        .then((task: any) : Promise <void | Error>  => {
            const {subtasks} = task.docs()
            const newSubtask: any = extend(subtask, values)
            return task.update({
                subtasks: <Array<SubtaskType>>updateWith(
                    subtasks,
                    '[' + subtasks.findIndex(subtask) + ']',
                    newSubtask
            )
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
