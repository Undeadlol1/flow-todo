import { Theme } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/styles';
import clsx from 'clsx';
import debug from 'debug';
import get from 'lodash/fp/get';
import isEmpty from 'lodash/isEmpty';
import isUndefined from 'lodash/isUndefined';
import React, { memo } from 'react';
import { Unless } from 'react-if';
import { isLoaded } from 'react-redux-firebase';
import CreateTaskFab from '../../components/tasks/CreateTaskFab';
import GetRandomTask from '../../components/tasks/RandomTaskButton/RandomTaskButton';
import { TagsList } from '../../components/tasks/TagsList';
import TasksDoneToday from '../../components/tasks/TasksDoneToday';
import AppTour from '../../components/ui/AppTour';
import WelcomeCard from '../../components/ui/WelcomeCard';
import { useScreenIsNarrow } from '../../services/index';
import {
  Task,
  useTypedSelector,
  TaskHistory,
  IDayliStreak,
} from '../../store/index';
import {
  profileSelector,
  taskLogsSelector as taskLogs,
  tasksDoneTodaySelector,
  tasksPerDaySelector,
  tasksSelector,
  uiSelector,
} from '../../store/selectors';

const log = debug('IndexPage');
const useStyles = makeStyles((theme: Theme) => ({
  pageContainer: {
    marginTop: 0,
    marginBottom: 0,
    minHeight: 'calc(100vh - 74px)',
  },
  randomButtonContainer: {
    margin: '0 auto',
  },
  fullWidth: {
    width: '100%',
  },
}));

interface Props {
  logs: TaskHistory[];
  streak: IDayliStreak;
  tasksPerDay: number;
  tasksToday: number;
  activeTasks?: Task[];
  isLoading?: boolean;
  isAppTourActive?: boolean;
  createdAtleastOneTask?: Task[];
}

export const IndexPage = memo(function HomePage(props: Props) {
  const classes = useStyles();
  const isScreeenNarrow = useScreenIsNarrow();

  const {
    isLoading,
    activeTasks,
    isAppTourActive,
    createdAtleastOneTask,
  } = props;
  log('isLoading: ', isLoading);
  log('activeTasks: %O', activeTasks);
  log('isAppTourActive: ', isAppTourActive);
  log('createdAtleastOneTask: ', !isEmpty(createdAtleastOneTask));

  function renderButtonOrWelcomeCard() {
    if (
      isLoading ||
      isAppTourActive ||
      !isEmpty(createdAtleastOneTask)
    )
      return <GetRandomTask className={'IntroHandle__taskButton'} />;
    else return <WelcomeCard />;
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
      <Grid item xs={12} sm={12} md={8} lg={6}>
        <Unless
          condition={Boolean(
            isEmpty(createdAtleastOneTask) || isAppTourActive,
          )}
        >
          <TasksDoneToday
            dailyStreak={props.streak}
            tasksPerDay={props.tasksPerDay}
            tasksToday={props.tasksToday}
            isLoaded={isLoaded(props.logs)}
          />
        </Unless>
      </Grid>
      <Grid
        item
        xs={12}
        sm={12}
        md={8}
        lg={6}
        className={clsx(
          classes.randomButtonContainer,
          isScreeenNarrow && classes.fullWidth,
        )}
      >
        {renderButtonOrWelcomeCard()}
      </Grid>
      <Grid item xs={12} sm={8} md={8} lg={6}>
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

export default memo(function HomePageContainer(props) {
  const logs = useTypedSelector(taskLogs);
  const streak = useTypedSelector(profileSelector).dailyStreak;
  const tasksPerDay = useTypedSelector(tasksPerDaySelector);
  const tasksToday = useTypedSelector(tasksDoneTodaySelector);
  const activeTasks = useTypedSelector(tasksSelector);
  const { createdAtleastOneTask } = useTypedSelector(
    get('firestore.ordered'),
  );
  const { isAppTourActive } = useTypedSelector(uiSelector);
  const isLoading =
    isUndefined(createdAtleastOneTask) || isUndefined(activeTasks);

  return (
    <IndexPage
      {...{
        logs,
        streak,
        tasksPerDay,
        tasksToday,
        isLoading,
        activeTasks,
        isAppTourActive,
        createdAtleastOneTask,
      }}
    />
  );
});
