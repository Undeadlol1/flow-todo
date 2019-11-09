// @flow
import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import {
  Switch,
  Route,
  Link,
  useLocation,
  useRouteMatch,
} from 'react-router-dom';
import SmileEmoticon from '@material-ui/icons/TagFaces';
import HeartIcon from '@material-ui/icons/Favorite';
import DoneIcon from '@material-ui/icons/Done';
import ErrorIcon from '@material-ui/icons/Error';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import { useTranslation } from 'react-i18next';
import Slide from '@material-ui/core/Slide';
import Fade from '@material-ui/core/Fade';
import get from 'lodash/get';
import addDays from 'date-fns/addDays';
import { calculateNextRepetition } from '../../../services';
import CreateSubtask from '../CreateSubtask/CreateSubtask';
import TasksList from '../TasksList/TasksList';
import SubtasksList from '../SubtasksList';

const useStyles = makeStyles(theme => ({
  button: {
    margin: theme.spacing(1),
  },
  doneButton: {
    marginTop: '30px',
  },
}));

const HardChoices = (props) => {
  const [t] = useTranslation();
  return (
    <Slide in direction="left">
      <div>
        <Grid item xs align="center">
          <Button>{t('Rework task')}</Button>
        </Grid>
        <Grid item xs={12} align="center">
          <CreateSubtask taskId={props.taskId} />
        </Grid>
        <Grid item xs={12} align="center">
          {/* TODO: fix "deleteTask" */}
          <SubtasksList taskId={props.taskId} documents={props.task.subtasks} />
        </Grid>
      </div>
    </Slide>
  );
};

const TroublesChoices = ({ updateTask }) => {
  const [t] = useTranslation();
  const { pathname } = useLocation();
  function postPone() {
    updateTask(
      { dueAt: addDays(new Date(), 1).getTime() },
      t('Posponed until tomorrow'),
      'default',
    );
  }
  return (
    <Slide in direction="left">
      <Grid container direction="column">
        <Grid item xs align="center">
          <Button component={Link} to={`${pathname}/isHard`}>
            {t('hard')}
          </Button>
        </Grid>
        <Grid item xs align="center">
          <Button>{t('dont want to')}</Button>
        </Grid>
        <Grid item xs align="center">
          <Button onClick={postPone}>
            {t('cant right now')}
          </Button>
        </Grid>
      </Grid>
    </Slide>
  );
};

TroublesChoices.propTypes = {
  updateTask: PropTypes.func.isRequired,
};


const TaskActions = (props) => {
  const [t] = useTranslation();
  const classes = useStyles();
  const { pathname } = useLocation();
  const didGood = () => props.updateTask(
      calculateNextRepetition(props.task, 'normal'),
      t('Good job!'),
    );
  const didGreat = () => props.updateTask(
      calculateNextRepetition(props.task, 'good'),
      t('Good job!'),
    );
  const setDone = () => props.updateTask(
    { isDone: true, doneAt: Date.now() },
    t('Good job!'),
  );
  return (
    <Fade in timeout={1200}>
      <Grid
        container
        direction="column"
        classes={{ root: props.className }}
      >
        <Grid item xs align="center">
          <Button
            color="secondary"
            variant="contained"
            component={Link}
            startIcon={<ErrorIcon />}
            className={classes.button}
            to={`${pathname}/isTroublesome`}
          >
            Есть трудности
          </Button>
        </Grid>
        <Grid item xs align="center">
          <Button
            className={classes.button}
            color="primary"
            variant="contained"
            startIcon={<HeartIcon />}
            onClick={didGood}
          >
            {t('made step forward')}
          </Button>
        </Grid>
        <Grid item xs align="center">
          <Button
            className={classes.button}
            color="primary"
            variant="contained"
            startIcon={<SmileEmoticon />}
            onClick={didGreat}
          >
            {t('advanced a lot')}
          </Button>
        </Grid>
        <Grid item xs align="center">
          <Button
            className={classes.doneButton}
            color="primary"
            variant="contained"
            startIcon={<DoneIcon />}
            onClick={setDone}
          >
            {t('done')}
          </Button>
        </Grid>
      </Grid>
    </Fade>
  );
};

TaskActions.propTypes = {
  className: PropTypes.string,
  task: PropTypes.object.isRequired,
  updateTask: PropTypes.func.isRequired,
};

export default props => {
  const { path } = useRouteMatch();
  return (
    <Switch>
      <Route path={`${path}/isTroublesome/isHard`}>
        <HardChoices {...props} />
      </Route>
      <Route path={`${path}/isTroublesome`}>
        <TroublesChoices {...props} />
      </Route>
      <Route path={path}>
        <TaskActions {...props} />
      </Route>
    </Switch>
  );
};
