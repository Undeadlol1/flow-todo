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
import { isLoaded } from 'react-redux-firebase';
import CreateTaskFab from '../../components/tasks/CreateTaskFab';
import { TagsList } from '../../components/tasks/TagsList';
import TasksDoneToday from '../../components/tasks/TasksDoneToday';
import { TasksList } from '../../components/tasks/TasksList';
import AppTour from '../../components/ui/AppTour';
import WelcomeCard from '../../components/ui/WelcomeCard';
import { useScreenIsNarrow } from '../../services/index';
import { useSelector } from 'react-redux';
import { IDayliStreak } from '../../entities/IDayliStreak';
import { TaskHistory } from '../../entities/TaskHistory';
import { Task } from '../../entities/Task';
import {
  authSelector,
  profileSelector,
  taskLogsSelector as taskLogs,
  tasksDoneTodaySelector,
  tasksSelector,
} from '../../store/selectors';

const log = debug('IndexPage');
const useStyles = makeStyles((theme: Theme) => ({
  pageContainer: {
    marginTop: 0,
    marginBottom: 0,
    minHeight: 'calc(100vh - 74px)',
  },
  randomButtonContainer: {},
  fullWidth: {
    width: '100%',
  },
}));

export interface IndexPageProps {
  logs: TaskHistory[];
  streak: IDayliStreak;
  tasksPerDay: number;
  tasksToday: number;
  activeTasks?: Task[];
  isLoading?: boolean;
  createdAtleastOneTask: boolean;
}

const sectionProps = {
  item: true,
  xs: 12,
  sm: 8,
  md: 8,
  lg: 6,
} as GridProps;

export const IndexPage = memo((props: IndexPageProps) => {
  const classes = useStyles();
  const isScreeenNarrow = useScreenIsNarrow();

  const {
    isLoading,
    activeTasks = [],
    createdAtleastOneTask,
  } = props;
  log('isLoading: ', isLoading);
  log('activeTasks: %O', activeTasks);
  log('createdAtleastOneTask: ', createdAtleastOneTask);

  function renderWelcomeCardOrContent() {
    if (isLoading || createdAtleastOneTask)
      return <TasksList tasks={activeTasks} loading={false} />;
    return <WelcomeCard />;
  }

  if (isLoading) {
    return (
      <Grid
        container
        spacing={2}
        justify="center"
        direction="column"
        alignItems="stretch"
        alignContent="center"
        className={classes.pageContainer}
      >
        <Grid {...sectionProps}>
          <Skeleton height="200px" width="350px" variant="rect" />
        </Grid>
      </Grid>
    );
  }

  return (
    <Grid
      container
      spacing={2}
      justify="center"
      direction="column"
      alignItems="stretch"
      alignContent="center"
      className={classes.pageContainer}
    >
      <Grid {...sectionProps}>
        <When condition={!!createdAtleastOneTask}>
          <TasksDoneToday
            dailyStreak={props.streak}
            tasksPerDay={props.tasksPerDay}
            tasksToday={props.tasksToday}
            isLoaded={isLoaded(props.logs)}
            isUpdateAnimationDisabled={true}
          />
        </When>
      </Grid>
      <Grid
        {...sectionProps}
        className={clsx(
          classes.randomButtonContainer,
          isScreeenNarrow && classes.fullWidth,
        )}
      >
        {renderWelcomeCardOrContent()}
      </Grid>
      <Grid {...sectionProps}>
        <Box mt={2}>
          <TagsList />
        </Box>
      </Grid>
      <CreateTaskFab
        isHidden={isLoading}
        className="IntroHandle__createTask"
      />
      <AppTour />
    </Grid>
  );
});

IndexPage.displayName = 'IndexPage';

export default memo((props) => {
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
