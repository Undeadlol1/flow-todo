import React, { useContext, memo } from 'react';
import Grid from '@material-ui/core/Grid';
import AddIcon from '@material-ui/icons/Add';
import { makeStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import { useTranslation } from 'react-i18next';
import cx from 'clsx';
import useToggle from 'react-use-toggle';
import TasksList from '../components/tasks/TasksList/TasksList';
import RandomTaskButton from '../components/tasks/RandomTaskButton/RandomTaskButton';
import UpsertTask from '../components/tasks/CreateTask/UpsertTask';
import AppTour from '../components/ui/AppTour';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from 'firebase/app';
import { If, Then, Else, When } from 'react-if';
import WelcomeCard from '../components/ui/WelcomeCard';
import { TasksContext } from '../store/contexts';
import { useSelector } from 'react-redux';
import Fab from '../components/ui/Fab';

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
  const { loading } = useContext(TasksContext);
  const { isAppTourActive } = useSelector((state: any) => state.ui);

  const isLoggedIn = Boolean(useAuthState(auth())[0]);
  const [isDialogOpen, toggleDialog] = useToggle(false);

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
        <If condition={loading || isAppTourActive || isLoggedIn}>
          <Then>
            <RandomTaskButton className={'IntroHandle__taskButton'} />
          </Then>
          <Else>
            <WelcomeCard />
          </Else>
        </If>
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
      <When condition={!loading && (isAppTourActive || isLoggedIn)}>
        <Fab
          aria-label={t('createTask')}
          className={cx(['IntroHandle__createTask'])}
          onClick={toggleDialog}
        >
          <AddIcon />
        </Fab>
      </When>
      <AppTour />
    </Grid>
  );
});
