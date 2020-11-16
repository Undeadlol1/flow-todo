import extend from 'lodash/extend';
import { Subtask } from '../entities/Subtask';
import { getFirestore, handleErrors } from '../services/index';

export function updateTask(values: {
  id: string;
  name?: string;
  tags?: string[];
  isCurrent?: boolean;
  subtasks?: Subtask[];
}): Promise<void | Error> {
  const payload = extend(values, {
    updatedAt: Date.now(),
  });

  return getFirestore()
    .collection('tasks')
    .doc(values.id)
    .set(payload, { merge: true })
    .catch(handleErrors);
}
