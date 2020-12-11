import get from 'lodash/fp/get';
import isEmpty from 'lodash/isEmpty';
import isUndefined from 'lodash/isUndefined';
import React, { memo } from 'react';
import { useSelector } from 'react-redux';
import {
  authSelector,
  profileSelector,
  taskLogsSelector as taskLogs,
  tasksDoneTodaySelector,
  tasksSelector,
} from '../../store/selectors';
import { IndexPage } from './IndexPage';

export const IndexPageContainer = memo(function IndexPageContainer() {
  const auth = useSelector(authSelector);
  const logs = useSelector(taskLogs);
  const streak = useSelector(profileSelector).dailyStreak;
  const tasksToday = useSelector(tasksDoneTodaySelector);
  const activeTasks = useSelector(tasksSelector);
  const { createdAtleastOneTask } = useSelector(
    get('firestore.ordered'),
  );

  let isLoading =
    isUndefined(createdAtleastOneTask) || isUndefined(activeTasks);
  if (auth.isEmpty) isLoading = false;
  if (!auth.isLoaded) isLoading = true;

  return (
    <IndexPage
      {...{
        logs,
        streak,
        tasksToday,
        isLoading,
        activeTasks,
        tasksPerDay: streak?.perDay,
        createdAtleastOneTask: !isEmpty(createdAtleastOneTask),
      }}
    />
  );
});
