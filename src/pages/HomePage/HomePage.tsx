import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import debug from 'debug';
import isEmpty from 'lodash/isEmpty';
import isUndefined from 'lodash/isUndefined';
import React, { memo } from 'react';
import CreateTaskFab from '../../components/tasks/CreateTaskFab';
import GetRandomTask from '../../components/tasks/RandomTaskButton/RandomTaskButton';
import AppTour from '../../components/ui/AppTour';
import WelcomeCard from '../../components/ui/WelcomeCard';
import { Task, useTypedSelector } from '../../store/index';

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
}));

interface Props {
  activeTasks?: Task[];
  isLoading?: boolean;
  isAppTourActive?: boolean;
  createdAtleastOneTask?: Task[];
}

export const HomePage = memo(function HomePage(props: Props) {
  const classes = useStyles();

  const {
    isLoading,
    activeTasks,
    isAppTourActive,
    createdAtleastOneTask,
  } = props;
  log('isLoading: ', isLoading);
  log('activeTasks: ', activeTasks);
  log('isAppTourActive: ', isAppTourActive);
  console.log('isAppTourActive: ', isAppTourActive);
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
      <Grid
        item
        xs={12}
        sm={8}
        md={8}
        lg={6}
        className={classes.randomButtonContainer}
      >
        {renderButtonOrWelcomeCard()}
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
  const { createdAtleastOneTask, activeTasks } = useTypedSelector(
    s => s.firestore.ordered,
  );
  const { isAppTourActive } = useTypedSelector(state => state.ui);
  const isLoading =
    isUndefined(createdAtleastOneTask) || isUndefined(activeTasks);
  return (
    <HomePage
      {...{
        isLoading,
        activeTasks,
        isAppTourActive,
        createdAtleastOneTask,
      }}
    />
  );
});
