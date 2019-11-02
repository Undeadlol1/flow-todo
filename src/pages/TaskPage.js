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
import { useDocumentData } from 'react-firebase-hooks/firestore';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
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
    color: 'white',
    textDecoration: 'none',
  },
  doneButton: {
    marginTop: '30px',
  },
  loadingContainer: {
    position: 'absolute',
    left: '50%',
    top: 'calc(50% - 56px)',
  },
  loading: {
  },
});

const HardChoices = () => {
  const { pathname } = useLocation();
  return (
    <Grid container direction="column">
      <Grid item xs align="center">
        <Button component={Link} to={`${pathname}/hard`}>Тяжело</Button>
      </Grid>
      <Grid item xs align="center">
        <Button>Не хочу</Button>
      </Grid>
      <Grid item xs align="center">
        <Button>Не могу сейчас</Button>
      </Grid>
    </Grid>
  );
};

const TaskActions = () => {
  const { pathname } = useLocation();
  return (
    <Grid container direction="column">
      <Grid item xs align="center">
        <Button component={Link} to={`${pathname}/hard`}>Мне трудно</Button>
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
      <Grid item xs align="center" className={classes.loadingContainer}>
        <CircularProgress className={classes.loading} />
      </Grid>
    );
  }

  return (
    <Grid className={classes.pageContainer} container direction="column">
      <Grid item xs align="center">
        <Link className={classes.link} to={`/tasks/${props.taskId}`}>
          <Typography className={classes.title} variant="h3">{props.task.name}</Typography>
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
  task: PropTypes.object.isRequired,
  path: PropTypes.string.isRequired,
  loading: PropTypes.bool.isRequired,
  taskId: PropTypes.string.isRequired,
  setDone: PropTypes.func.isRequired,
};

export default (props) => {
  const { taskId } = useParams();
  const [isRequested, setRequested] = React.useState();
  const taskPointer = firestore().collection('tasks').doc(taskId);
  const [task, loading] = useDocumentData(taskPointer);
  const { path } = useRouteMatch();
  const history = useHistory();
  const mergedProps = {
    setDone() {
      setRequested(true);
      return taskPointer
        .update({ isDone: true, doneAt: Date.now() })
        .then(() => history.push('/'));
    },
    task: task || {},
    loading: loading || isRequested,
    taskId,
    path,
    ...props,
  };
  return (
    <TaskPage {...mergedProps} />
  );
};
