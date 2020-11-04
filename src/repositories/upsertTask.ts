import subDays from 'date-fns/subDays';
import extend from 'lodash/extend';
import nanoid from 'nanoid';
import { getFirestore, handleErrors } from '../services/index';

export function upsertTask(
  values: {
    name?: string;
    tags?: string[];
    userId?: string;
    isCurrent?: boolean;
  },
  taskId?: string,
): Promise<void | Error> {
  const isCreate = !taskId;
  if (isCreate && !values.userId) {
    return Promise.reject('You forgot to add userId');
  }

  const now = new Date().getTime();
  const payload = extend(
    values,
    isCreate
      ? {
          isDone: false,
          createdAt: now,
          dueAt: subDays(now, 1).getTime(),
        }
      : {
          updatedAt: now,
        },
  );

  return getFirestore()
    .collection('tasks')
    .doc(taskId || nanoid())
    .set(payload, { merge: true })
    .catch(handleErrors);
}
