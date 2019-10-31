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
} from 'react-router-dom';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';

const HardChoices = (props) => {
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

const TaskActions = (props) => {
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
  if (props.loading) {
    return (
      <Grid item xs align="center">
        <CircularProgress />
      </Grid>
    );
  }
  return (
    <Grid container direction="column">
      <Grid item xs align="center">
        <Link to={`/task/${props.taskId}`}>
          <Typography variant="h3">{props.task.name}</Typography>
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
    </Grid>
  );
}

TaskPage.propTypes = {
  task: PropTypes.object,
  path: PropTypes.string.isRequired,
  loading: PropTypes.bool.isRequired,
  taskId: PropTypes.string.isRequired,
};

export default (props) => {
  const { taskId } = useParams();
  const [task, loading] = useDocumentData(
    firestore().collection('tasks').doc(taskId),
  );
  const { path } = useRouteMatch();
  const mergedProps = {
    task, loading, taskId, path, ...props,
  };
  return (
    <TaskPage {...mergedProps} />
  );
};
