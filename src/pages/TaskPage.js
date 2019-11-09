import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import { firestore } from 'firebase/app';
import {
  useParams,
  Link,
  useHistory,
} from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import Zoom from '@material-ui/core/Zoom';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import AssigmentIcon from '@material-ui/icons/Assignment';

import get from 'lodash/get';
import isString from 'lodash/isString';

import Paper from '@material-ui/core/Paper';
import { When, Unless } from 'react-if';
import filter from 'lodash/filter';
import Collapsible from '../components/ui/Collapsible';
import UpsertNote from '../components/tasks/UpsertNote/UpsertNote';
import TaskChoices from '../components/tasks/TaskChoices/TaskChoices';

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
      <Grid item component={CircularProgress} align="center" className={classes.loadingContainer} />
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
            <Button fullWidth variant="outlined" startIcon={hasSubtasks && <AssigmentIcon fontSize="large" />}>
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
      <TaskChoices className={classes.choices} {...props} />
    </Grid>
  );
}

TaskPage.propTypes = {
  loading: PropTypes.bool,
  task: PropTypes.object.isRequired,
  taskId: PropTypes.string.isRequired,
};

export default (props) => {
  const history = useHistory();
  const [t] = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const [isRequested, setRequested] = useState();

  const { taskId } = useParams();
  const taskPointer = firestore()
    .collection('tasks')
    .doc(taskId);
  const [task, taskLoading, taskError] = useDocumentData(taskPointer);

  if (taskError) enqueueSnackbar(t('Something went wrong'), { variant: 'error' });

  const mergedProps = {
    updateTask(values, message, variant = 'success') {
      setRequested(true);
      return taskPointer
        .update(values)
        .then(() => {
          if (message) enqueueSnackbar(message, { variant });
          history.push('/');
        })
        .catch(e => enqueueSnackbar(
          get(e, 'message') || t('Something went wrong'),
          { variant: 'error' },
        ));
    },
    task: task || {},
    loading: taskLoading || isRequested,
    taskId,
    ...props,
  };
  return <TaskPage {...mergedProps} />;
};
