import React from 'react';
import Grid from '@material-ui/core/Grid';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import { makeStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import { useTranslation } from 'react-i18next';
import TasksList from '../components/tasks/TasksList/TasksList';
import RandomTaskButton from '../components/tasks/RandomTaskButton/RandomTaskButton';
import CreateTask from '../components/tasks/CreateTask/CreateTask';

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
  const [isDialogOpen, setDialog] = React.useState(false);
  const toggleDialog = () => setDialog(!isDialogOpen);
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
      <Grid item xs={12} sm={8} md={8} lg={6} align="center">
        <RandomTaskButton />
      </Grid>
      <Grid item xs={12} sm={8} md={8} lg={6} align="center">
        <TasksList />
      </Grid>
      <Dialog
        open={isDialogOpen}
        aria-labelledby="form-dialog-title"
        onClose={toggleDialog}
      >
        <DialogContent>
          <CreateTask />
        </DialogContent>
      </Dialog>
      <Fab
        color="primary"
        aria-label={t('createTask')}
        className={classes.fab}
        onClick={toggleDialog}
      >
        <AddIcon />
      </Fab>
    </Grid>
  );
}
