import React from 'react';
import Grid from '@material-ui/core/Grid';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import { makeStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import { useTranslation } from 'react-i18next';
import cx from 'clsx';
import useToggle from 'react-use-toggle';
import TasksList from '../components/tasks/TasksList/TasksList';
import RandomTaskButton from '../components/tasks/RandomTaskButton/RandomTaskButton';
import CreateTask from '../components/tasks/CreateTask/CreateTask';
import AppTour from '../components/ui/AppTour';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from 'firebase/app';
import { If, Then, Else, When } from 'react-if';
import WelcomeCard from '../components/ui/WelcomeCard';
import { useGlobal } from '../store/ui';

const useStyles = makeStyles(theme => ({
  pageContainer: {
    minHeight: 'calc(100vh - 64px)',
  },
  fab: {
    position: 'fixed',
    [theme.breakpoints.down('sm')]: {
      bottom: theme.spacing(2),
      right: theme.spacing(2),
    },
    [theme.breakpoints.up('md')]: {
      bottom: theme.spacing(4),
      right: theme.spacing(4),
    },
    [theme.breakpoints.up('lg')]: {
      bottom: theme.spacing(6),
      right: theme.spacing(8),
    },
  },
}));

export default function HomePage() {
  const classes = useStyles();
  const [t] = useTranslation();
  const [user] = useAuthState(auth());
  const isLoggedIn = Boolean(user);
  const [state] = useGlobal();
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
      <Grid item xs={12} sm={8} md={8} lg={6}>
        <If condition={state.isAppTourActive || isLoggedIn}>
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
          <CreateTask autoFocus callback={toggleDialog} />
        </DialogContent>
      </Dialog>
      <When condition={state.isAppTourActive || isLoggedIn}>
        <Fab
          color="primary"
          aria-label={t('createTask')}
          className={cx([classes.fab, 'IntroHandle__createTask'])}
          onClick={toggleDialog}
        >
          <AddIcon />
        </Fab>
      </When>
      <AppTour />
    </Grid>
  );
}
