import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import cx from 'clsx';
import debug from 'debug';
import { auth } from 'firebase/app';
import React, { memo, useContext } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useTranslation } from 'react-i18next';
import useToggle from 'react-use-toggle';
import UpsertTask from '../components/tasks/CreateTask/UpsertTask';
import GetRandomTask from '../components/tasks/RandomTaskButton/RandomTaskButton';
import TasksList from '../components/tasks/TasksList/TasksList';
import AppTour from '../components/ui/AppTour';
import Fab from '../components/ui/Fab';
import WelcomeCard from '../components/ui/WelcomeCard';
import { TasksContext } from '../store/contexts';
import { useTypedSelector } from '../store/index';

const log = debug('HomePage');
debug.enable('HomePage');
const useStyles = makeStyles(theme => ({
  pageContainer: {
    minHeight: 'calc(100vh - 64px)',
  },
  randomButtonContainer: {
    margin: '0 auto',
  },
}));

export default memo(function HomePage() {
  const classes = useStyles();
  const [t] = useTranslation();
  const { loading: isLoading } = useContext(TasksContext);
  const { isAppTourActive } = useTypedSelector(state => state.ui);
  // @ts-ignore
  const { createdAtleastOneTask } = useTypedSelector(
    // @ts-ignore
    state => state.firestore.ordered,
  );

  log('createdAtleastOneTask: ', createdAtleastOneTask);
  const isLoggedIn = Boolean(useAuthState(auth())[0]);
  const [isDialogOpen, toggleDialog] = useToggle(false);
  const isButtonVisible =
    isLoading || isAppTourActive || !isEmpty(createdAtleastOneTask);

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
        {isButtonVisible && (
          <GetRandomTask className={'IntroHandle__taskButton'} />
        )}
        {!isButtonVisible && <WelcomeCard />}
      </Grid>
      <Grid item xs={12} sm={8} md={8} lg={6}>
        <TasksList />
      </Grid>
      <Dialog
        open={isDialogOpen}
        onClose={toggleDialog}
        aria-labelledby="form-dialog-title"
      >
        <DialogContent>
          <UpsertTask autoFocus beforeSubmitHook={toggleDialog} />
        </DialogContent>
      </Dialog>
      <Fab
        onClick={toggleDialog}
        aria-label={t('createTask')}
        className={cx(['IntroHandle__createTask'])}
        isHidden={isLoading || (!isLoggedIn && !isAppTourActive)}
      >
        <AddIcon />
      </Fab>
      <AppTour />
    </Grid>
  );
});
