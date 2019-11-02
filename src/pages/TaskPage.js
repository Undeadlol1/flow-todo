import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import { firestore } from 'firebase/app';
import {
  useParams,
  Switch,
  Route,
  Link,
  useRouteMatch,
  useLocation,
  useHistory,
} from 'react-router-dom';
import { withSnackbar } from 'notistack';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  pageContainer: {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
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
  loadingContainer: {
    position: 'absolute',
    left: 'calc(50% - 15px)',
    top: 'calc(50% - 56px)',
  },
  loading: {},
}));

const HardChoices = ({ postponeTask }) => {
  const { pathname } = useLocation();
  return (
    <Grid container direction="column">
      <Grid item xs align="center">
        <Button component={Link} to={`${pathname}/hard`}>
          Тяжело
        </Button>
      </Grid>
      <Grid item xs align="center">
        <Button>Не хочу</Button>
      </Grid>
      <Grid item xs align="center">
        <Button onClick={postponeTask}>Не могу сейчас</Button>
      </Grid>
    </Grid>
  );
};

HardChoices.propTypes = {
  postponeTask: PropTypes.func.isRequired,
};

const TaskActions = () => {
  const { pathname } = useLocation();
  return (
    <Grid container direction="column">
      <Grid item xs align="center">
        <Button component={Link} to={`${pathname}/hard`}>
          Есть трудности
        </Button>
      </Grid>
      <Grid item xs align="center">
        <Button>Сделал шаг вперед</Button>
      </Grid>
      <Grid item xs align="center">
        <Button>Сильно продвинулся</Button>
      </Grid>
    </Grid>
  );
};

export function TaskPage(props) {
  const classes = useStyles();
  if (props.loading) {
    return (
      <Grid
        xs
        item
        align="center"
        className={classes.loadingContainer}
      >
        <CircularProgress className={classes.loading} />
      </Grid>
    );
  }

  return (
    <Grid
      container
      direction="column"
      className={classes.pageContainer}
    >
      <Grid item xs align="center">
        <Link className={classes.link} to={`/tasks/${props.taskId}`}>
          <Typography className={classes.title} variant="h3">
            {props.task.name}
          </Typography>
        </Link>
      </Grid>
      <Switch>
        <Route path={`${props.path}/hard`}>
          <HardChoices {...props} />
        </Route>
        <Route path={props.path}>
          <TaskActions {...props} />
        </Route>
      </Switch>
      <Grid item xs align="center">
        <Button
          className={classes.doneButton}
          color="primary"
          variant="contained"
          onClick={props.setDone}
        >
          Сделал
        </Button>
      </Grid>
    </Grid>
  );
}

TaskPage.propTypes = {
  loading: PropTypes.bool,
  task: PropTypes.object.isRequired,
  path: PropTypes.string.isRequired,
  taskId: PropTypes.string.isRequired,
  setDone: PropTypes.func.isRequired,
};

export default withSnackbar(props => {
  const { taskId } = useParams();
  const [isRequested, setRequested] = React.useState();
  const taskPointer = firestore()
    .collection('tasks')
    .doc(taskId);
  const [task, loading] = useDocumentData(taskPointer);
  const { path } = useRouteMatch();
  const history = useHistory();
  const mergedProps = {
    setDone() {
      setRequested(true);
      return taskPointer
        .update({ isDone: true, doneAt: Date.now() })
        .then(() => history.push('/'))
        .catch(e => console.error(e));
    },
    postponeTask() {
      setRequested(true);
      return taskPointer
        .update({ dueAt: Date.now() + 1000 * 60 * 60 * 24 })
        .then(() => {
          props.enqueueSnackbar('Отложено до завтра');
          history.push('/');
        })
        .catch(e => console.error(e));
    },
    task: task || {},
    loading: loading || isRequested,
    taskId,
    path,
    ...props,
  };
  return <TaskPage {...mergedProps} />;
});
