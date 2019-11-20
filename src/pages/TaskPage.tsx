import React, { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import { firestore } from 'firebase/app';
import { useParams, Link, useHistory } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import Zoom from '@material-ui/core/Zoom';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import get from 'lodash/get';
import isString from 'lodash/isString';
import { When } from 'react-if';
import filter from 'lodash/filter';
import Collapsible from '../components/ui/Collapsible';
import UpsertNote from '../components/tasks/UpsertNote/UpsertNote';
import TaskChoices from '../components/tasks/TaskChoices/TaskChoices';
import { updateSubtask, deleteTask } from '../store';
import { calculateNextRepetition } from '../services';
import AppTour from '../components/ui/AppTour';
import { Task, Subtask } from '../store/index';
import { TasksContext } from '../store/contexts';
import invoke from 'lodash/invoke';
import { useSnackbar as useMaterialSnackbar } from 'material-ui-snackbar-provider';
import random from 'lodash/random';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';

const useStyles = makeStyles(theme => ({
  pageContainer: {
    minHeight: 'calc(100vh - 64px)',
  },
  loadingContainer: {
    position: 'absolute',
    left: 'calc(50% - 15px)',
    top: 'calc(50% - 56px)',
  },
  link: {
    textDecoration: 'none',
    color: theme.palette.text.primary,
  },
  choices: {
    marginTop: '20px',
  },
}));

interface ITaskPageProps {
  task: Task;
  taskId: string;
  loading: boolean;
  isAppIntroMode: boolean;
}

export function TaskPage(props: ITaskPageProps) {
  const classes = useStyles();
  const { loading, taskId, task } = props;
  const activeSubtasks = filter(task.subtasks, i => !i.isDone);
  const hasSubtasks = Boolean(activeSubtasks.length);

  if (loading) {
    return (
      <Grid
        item
        component={CircularProgress}
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
      <Grid item xs={12} sm={8} md={4} lg={3}>
        <Link className={classes.link} to={`/tasks/${taskId}`}>
          <Zoom in>
            <Card>
              <CardContent>
                <When condition={hasSubtasks}>
                  <Typography color="textSecondary" gutterBottom>
                    {task.name}
                  </Typography>
                </When>
                <Typography variant="h5" component="h1">
                  {get(activeSubtasks, '[0].name') || task.name}
                </Typography>
              </CardContent>
            </Card>
          </Zoom>
        </Link>
      </Grid>
      <Grid item xs={12}>
        <Grid
          item
          xs={12}
          sm={8}
          md={6}
          lg={5}
          style={{ margin: '0 auto' }}
        >
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

function filterCurrentTask(tasks: Task[]): Task[] {
  return tasks.filter(t => !t.isCurrent);
}

function getRandomTaskId(tasks: Task[]): Task[] {
  return get(tasks, `[${random(tasks.length - 1)}].id`);
}

export default () => {
  const [t] = useTranslation();
  const history = useHistory();
  const snackbar = useMaterialSnackbar();
  const { enqueueSnackbar } = useSnackbar();
  const [isRequested, setRequested] = useState();
  // TODO this needs to be a service
  const handleErrors = (e: Error) =>
    enqueueSnackbar(get(e, 'message') || t('Something went wrong'), {
      variant: 'error',
    });

  const { taskId } = useParams();
  const isAppIntroMode = taskId === 'introExample';
  const taskPointer = firestore()
    .collection('tasks')
    .doc(taskId);
  const { tasks } = useContext(TasksContext);
  // TODO: this is a mess. Rework this
  const currentTask = invoke(
    // @ts-ignore
    get<Task[]>(tasks, 'docs', []).find((t: Task) =>
      // @ts-ignore
      t.get('isCurrent'),
    ),
    'data',
  );
  const nextTaskId = getRandomTaskId(
    // @ts-ignore
    filterCurrentTask(get<Task[]>(tasks, 'docs', [])),
  );

  let [task, taskLoading, taskError] = useDocumentData(
    // @ts-ignore
    !isAppIntroMode || !currentTask ? taskPointer : undefined,
  );

  if (taskError) handleErrors(taskError);
  if (isAppIntroMode) {
    task = {
      name: t('exampleTask'),
    };
  }

  const mergedProps = {
    deleteTask() {
      history.push('/');
      if (taskId)
        return deleteTask(taskId)
          .then(() => {
            snackbar.showMessage(
              t('successfullyDeleted'),
              // TODO
              // 'undo',
              // () => console.log('undo is called'),
            );
          })
          .catch(e => {
            handleErrors(e);
            history.push(`/tasks/${taskId}`);
          });
    },
    updateTask(values: object, message: string, variant?: 'success') {
      setRequested(true);
      return taskPointer
        .update(values)
        .then(() => {
          // @ts-ignore
          if (message) enqueueSnackbar(message, { variant });
          history.push(`/${nextTaskId || ''}`);
        })
        .catch(e => handleErrors(e));
    },
    updateSubtask(subtask: Subtask) {
      setRequested(true);
      return updateSubtask(subtask, {
        isDone: true,
        doneAt: Date.now(),
      })
        .then(() => {
          this.updateTask(
            {
              isCurrent: false,
              ...calculateNextRepetition(task, 'good'),
            },
            t('Good job!'),
          );
        })
        .catch((e: Error) => handleErrors(e));
    },
    task: task || {},
    loading: taskLoading || isRequested,
    taskId,
    isAppIntroMode,
  };
  // TODO: remoove @ts-ignore
  // @ts-ignore
  return <TaskPage {...mergedProps} />;
};
