import { Theme } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import Grid, { GridProps } from '@material-ui/core/Grid';
import Skeleton from '@material-ui/lab/Skeleton';
import { makeStyles } from '@material-ui/styles';
import clsx from 'clsx';
import debug from 'debug';
import get from 'lodash/fp/get';
import isEmpty from 'lodash/isEmpty';
import isUndefined from 'lodash/isUndefined';
import React, { memo } from 'react';
import { When } from 'react-if';
import { useSelector } from 'react-redux';
import { isLoaded } from 'react-redux-firebase';
import CreateTaskFab from '../../components/tasks/CreateTaskFab';
import { TagsList } from '../../components/tasks/TagsList';
import TasksDoneToday from '../../components/tasks/TasksDoneToday';
import { TasksList } from '../../components/tasks/TasksList';
import WelcomeCard from '../../components/ui/WelcomeCard';
import { IDayliStreak } from '../../entities/IDayliStreak';
import { Task } from '../../entities/Task';
import { TaskHistory } from '../../entities/TaskHistory';
import { useIsScreenNarrow } from '../../hooks/useIsScreenNarrow';
import {
  authSelector,
  profileSelector,
  taskLogsSelector as taskLogs,
  tasksDoneTodaySelector,
  tasksSelector,
} from '../../store/selectors';

const log = debug('IndexPage');
const useStyles = makeStyles((theme: Theme) => ({
  fullWidth: {
    width: '100%',
  },
  pageContainer: {
    marginTop: 0,
    marginBottom: 0,
    minHeight: 'calc(100vh - 74px)',
  },
}));

export interface IndexPageProps {
  tasksToday: number;
  logs: TaskHistory[];
  tasksPerDay: number;
  isLoading?: boolean;
  streak: IDayliStreak;
  activeTasks?: Task[];
  createdAtleastOneTask: boolean;
}

const rootWrapperProps: GridProps = {
  spacing: 2,
  container: true,
  justify: 'center',
  direction: 'column',
  alignItems: 'stretch',
  alignContent: 'center',
};

const sectionProps: GridProps = {
  sm: 8,
  md: 8,
  lg: 6,
  xs: 12,
  item: true,
};

export const IndexPage = memo(
  ({
    isLoading,
    activeTasks = [],
    createdAtleastOneTask,
    ...props
  }: IndexPageProps) => {
    const classes = useStyles();
    const isScreeenNarrow = useIsScreenNarrow();

    rootWrapperProps.className = classes.pageContainer;

    log('isLoading: ', isLoading);
    log('activeTasks: %O', activeTasks);
    log('createdAtleastOneTask: ', createdAtleastOneTask);

    if (isLoading) {
      return (
        <Grid {...rootWrapperProps}>
          <Grid {...sectionProps}>
            <Skeleton height="200px" width="350px" variant="rect" />
          </Grid>
        </Grid>
      );
    }

    return (
      <Grid {...rootWrapperProps}>
        <Grid {...sectionProps}>
          <When condition={!!createdAtleastOneTask}>
            <TasksDoneToday
              dailyStreak={props.streak}
              tasksToday={props.tasksToday}
              tasksPerDay={props.tasksPerDay}
              isLoaded={isLoaded(props.logs)}
              isUpdateAnimationDisabled={true}
            />
          </When>
        </Grid>
        <Grid
          {...sectionProps}
          className={clsx({
            [classes.fullWidth]: isScreeenNarrow,
          })}
        >
          {createdAtleastOneTask ? (
            <TasksList tasks={activeTasks} loading={false} />
          ) : (
            <WelcomeCard />
          )}
        </Grid>
        <Grid {...sectionProps}>
          <Box mt={2} />
          <TagsList />
        </Grid>
        <CreateTaskFab isHidden={isLoading} />
      </Grid>
    );
  },
);

IndexPage.displayName = 'IndexPage';

export default memo(() => {
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
