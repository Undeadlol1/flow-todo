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
import { calculateNextRepetition } from 'services';
import addDays from 'date-fns/addDays';

const useStyles = makeStyles(theme => ({
  button: {
    margin: theme.spacing(1),
  },
  doneButton: {
    marginTop: '30px',
  },
}));

const CreateSubtask = props => <div>This is a test</div>;

CreateSubtask.propTypes = {};

const HardChoices = () => {
  const [t] = useTranslation();
  return (
    <Slide in direction="left">
      <Grid container direction="column">
        <Grid item xs align="center">
          <Button>{t('Rework task')}</Button>
        </Grid>
        <Grid item xs align="center">
          <Button>{t('Add subtasks')}</Button>
          <CreateSubtask />
        </Grid>
      </Grid>
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
            Тяжело
          </Button>
        </Grid>
        <Grid item xs align="center">
          <Button>Не хочу</Button>
        </Grid>
        <Grid item xs align="center">
          <Button onClick={postPone}>Не могу сейчас</Button>
        </Grid>
      </Grid>
    </Slide>
  );
};

TroublesChoices.propTypes = {
  updateTask: PropTypes.func.isRequired,
};

type TaskActionsProps = {
  className: ?string,
  task: Object,
  updateTask: Function,
};

const TaskActions = (props: TaskActionsProps) => {
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
            Сделал шаг вперед
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
            Сильно продвинулся
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
            Сделал
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
