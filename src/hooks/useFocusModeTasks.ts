import { useSelector } from 'react-redux';
import { useFirestoreConnect } from 'react-redux-firebase';
import { Task } from '../entities/Task';
import { authSelector, focusModeTasksSelector } from '../store/selectors';

export function useFocusModeTasks(): {
  focusModeTasks: Task[];
} {
  const userId = useSelector(authSelector).uid;
    const focusModeTasks = useSelector(focusModeTasksSelector)

  useFirestoreConnect(
    userId && [
      {
        limit: 100,
        collection: 'tasks',
        storeAs: 'focusModeTasks',
        where: [
          ['userId', '==', userId],
          ['isFocusedOn', '==', true],
        ],
      },
    ],
  );

  return {
    focusModeTasks
  };
}
