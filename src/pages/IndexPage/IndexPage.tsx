import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import debug from 'debug';
import get from 'lodash/fp/get';
import isEmpty from 'lodash/isEmpty';
import isUndefined from 'lodash/isUndefined';
import React, { memo } from 'react';
import { Unless } from 'react-if';
import CreateTaskFab from '../../components/tasks/CreateTaskFab';
import DayliTasksStreak from '../../components/tasks/DayliTasksStreak';
import GetRandomTask from '../../components/tasks/RandomTaskButton/RandomTaskButton';
import { TagsList } from '../../components/tasks/TagsList';
import TasksDoneToday from '../../components/tasks/TasksDoneToday';
import PinnedTask from '../../components/tasks/TasksList/PinnedTask';
import AppTour from '../../components/ui/AppTour';
import WelcomeCard from '../../components/ui/WelcomeCard';
import { useScreenIsNarrow } from '../../services/index';
import { Task, useTypedSelector } from '../../store/index';
import { tasksSelector, uiSelector } from '../../store/selectors';

const log = debug('HomePage');
const useStyles = makeStyles(theme => ({
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
  log('activeTasks: ', activeTasks);
  log('isAppTourActive: ', isAppTourActive);
  log('createdAtleastOneTask: ', createdAtleastOneTask);

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
          <TasksDoneToday />
          <DayliTasksStreak />
        </Unless>
      </Grid>
      <Grid item xs={12} sm={12} md={8} lg={6}>
        <PinnedTask />
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
        <TagsList />
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
        isLoading,
        activeTasks,
        isAppTourActive,
        createdAtleastOneTask,
      }}
    />
  );
});