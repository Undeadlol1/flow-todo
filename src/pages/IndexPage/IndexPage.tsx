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
import { authSelector } from '../../store/selectors';
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

interface Props {
  logs: TaskHistory[];
  streak: IDayliStreak;
  tasksPerDay: number;
  tasksToday: number;
  activeTasks?: Task[];
  isLoading?: boolean;
  createdAtleastOneTask: boolean;
}

export const IndexPage = memo(function HomePage(props: Props) {
  const classes = useStyles();
  const isScreeenNarrow = useScreenIsNarrow();

  const { isLoading, activeTasks, createdAtleastOneTask } = props;
  log('isLoading: ', isLoading);
  log('activeTasks: %O', activeTasks);
  log('createdAtleastOneTask: ', createdAtleastOneTask);

  function renderButtonOrWelcomeCard() {
    if (isLoading || createdAtleastOneTask)
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
        <Unless condition={!createdAtleastOneTask}>
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

IndexPage.displayName = 'IndexPage';

export default memo(function HomePageContainer(props) {
  const auth = useTypedSelector(authSelector);
  const logs = useTypedSelector(taskLogs);
  const streak = useTypedSelector(profileSelector).dailyStreak;
  const tasksToday = useTypedSelector(tasksDoneTodaySelector);
  const activeTasks = useTypedSelector(tasksSelector);
  const { createdAtleastOneTask } = useTypedSelector(
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
