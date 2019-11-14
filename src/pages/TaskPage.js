import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import { firestore } from 'firebase/app';
import { useParams, Link, useHistory } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import Zoom from '@material-ui/core/Zoom';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import AssigmentIcon from '@material-ui/icons/Assignment';
import clsx from 'clsx';

import get from 'lodash/get';
import isString from 'lodash/isString';

import Paper from '@material-ui/core/Paper';
import { When, Unless } from 'react-if';
import filter from 'lodash/filter';
import Collapsible from '../components/ui/Collapsible';
import UpsertNote from '../components/tasks/UpsertNote/UpsertNote';
import TaskChoices from '../components/tasks/TaskChoices/TaskChoices';
import { updateSubtask, deleteTask } from '../store';
import { calculateNextRepetition } from '../services';
import AppTour from '../components/ui/AppTour';

const useStyles = makeStyles(theme => ({
  pageContainer: {
    minHeight: 'calc(100vh - 64px)',
  },
  loadingContainer: {
    position: 'absolute',
    left: 'calc(50% - 15px)',
    top: 'calc(50% - 56px)',
  },
  title: {
    marginTop: '20px',
    marginBottom: '20px',
  },
  link: {
    color: theme.palette.text.primary,
    textDecoration: 'none',
  },
  doneButton: {
    marginTop: '30px',
  },
  choices: {
    marginTop: '20px',
  },
}));

export function TaskPage(props) {
  const classes = useStyles();
  const { loading, taskId, task } = props;
  const activeSubtasks = filter(task.subtasks, i => !i.isDone);
  const hasSubtasks = Boolean(activeSubtasks.length);

  if (loading) {
    return (
      <Grid
        item
        component={CircularProgress}
        align="center"
        className={classes.loadingContainer}
      />
    );
  }

  return (
    <Grid
      container
      spacing={4}
      direction="row"
      justify="center"
      alignItems="center"
      alignContent="center"
      className={classes.pageContainer}
    >
      <Grid item xs={12} sm={8} md={4} lg={3} align="center">
        <Link className={classes.link} to={`/tasks/${taskId}`}>
          <Paper elevation={6}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={
                hasSubtasks && <AssigmentIcon fontSize="large" />
              }
            >
              <Zoom in>
                <Typography className={classes.title} variant="h5">
                  <When condition={hasSubtasks}>
                    {get(activeSubtasks, '[0].name')}
                  </When>
                  <Unless condition={hasSubtasks}>{task.name}</Unless>
                </Typography>
              </Zoom>
            </Button>
          </Paper>
        </Link>
      </Grid>
      <Grid item xs={12} align="center">
        <Grid item xs={12} sm={8} md={6} lg={5}>
          <Collapsible isOpen={isString(task.note)}>
            <UpsertNote taskId={taskId} defaultValue={task.note} />
          </Collapsible>
        </Grid>
      </Grid>
      <TaskChoices
        {...props}
        className={clsx(['IntroHandle__taskButton', classes.choices])}
      />
      <When condition={props.isAppIntroMode}>
        <AppTour step={2} />
      </When>
    </Grid>
  );
}

TaskPage.propTypes = {
  loading: PropTypes.bool,
  task: PropTypes.object.isRequired,
  taskId: PropTypes.string.isRequired,
  isAppIntroMode: PropTypes.bool,
};

export default props => {
  const [t] = useTranslation();
  const history = useHistory();
  const { enqueueSnackbar } = useSnackbar();
  const [isRequested, setRequested] = useState();
  const handleErrors = e => enqueueSnackbar(get(e, 'message') || t('Something went wrong'), {
      variant: 'error',
    });

  const { taskId } = useParams();
  const isAppIntroMode = taskId === 'introExample';
  const taskPointer = firestore()
    .collection('tasks')
    .doc(taskId);
  // eslint-disable-next-line prefer-const
  let [task, taskLoading, taskError] = useDocumentData(
    !isAppIntroMode && taskPointer,
  );

  if (taskError) handleErrors(taskError);
  if (isAppIntroMode) {
    task = {
      // TODO add translation
      name: 'example', // t(''),
    };
  }

  const mergedProps = {
    deleteTask() {
      history.push('/');
      return deleteTask(taskId)
        .then(() => {
          enqueueSnackbar(t('successfullyDeleted'));
        })
        .catch(e => {
          handleErrors(e);
          history.push(`/tasks/${taskId}`);
        });
    },
    updateTask(values, message, variant = 'success') {
      setRequested(true);
      return taskPointer
        .update(values)
        .then(() => {
          if (message) enqueueSnackbar(message, { variant });
          history.push('/');
        })
        .catch(e => handleErrors(e));
    },
    updateSubtask(subtask) {
      setRequested(true);
      return updateSubtask(subtask, {
        isDone: true,
        doneAt: Date.now(),
      })
        .then(() => {
          this.updateTask(
            calculateNextRepetition(task, 'good'),
            t('Good job!'),
          );
        })
        .catch(e => handleErrors(e));
    },
    task: task || {},
    loading: taskLoading || isRequested,
    taskId,
    isAppIntroMode,
    ...props,
  };
  return <TaskPage {...mergedProps} />;
};
