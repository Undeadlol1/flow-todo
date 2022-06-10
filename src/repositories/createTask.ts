import subDays from 'date-fns/subDays';
import extend from 'lodash/extend';
import { getFirestore, handleErrors } from '../services/index';
import { Subtask } from '../entities/Subtask';
import { getUniqueId } from '../helpers/getUniqueId';

export function createTask(values: {
  id?: string;
  name: string;
  userId: string;
  note?: string;
  tags?: string[];
  subtasks?: Subtask[];
}) {
  return (
    getFirestore()
      .collection('tasks')
      .doc(values.id || getUniqueId())
      // TODO: was tired while writing this code.
      // Is this correct*
      .set(
        extend(values, {
          isDone: false,
          createdAt: Date.now(),
          dueAt: subDays(new Date(), 1).getTime(),
        }),
        { merge: true },
      )
      .catch(handleErrors)
  );
}
