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
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import { useTranslation } from 'react-i18next';
import Slide from '@material-ui/core/Slide';
import Fade from '@material-ui/core/Fade';
import get from 'lodash/get';
import CreateSubtask from '../CreateSubtask/CreateSubtask';
import { TasksList } from '../TasksList/TasksList';

const useStyles = makeStyles(theme => ({
  doneButton: {
    marginTop: '30px',
  },
}));

const HardChoices = (props) => {
  const [t] = useTranslation();
  return (
    <Slide in direction="left">
      <Grid container direction="column">
        <Grid item xs align="center">
          <Button>
            {t('Rework task')}
          </Button>
        </Grid>
        <Grid item xs align="center">
          <Button>
            {t('Add subtasks')}
          </Button>
          <CreateSubtask taskId={props.taskId} />
          {/* TODO: fix "deleteTask" */}
          {
            get(props, 'task.subtasks', []).map(({ name }) => <div key={name}>{name}</div>)
          }
          {/* <TasksList tasks={props.task.subtasks} deleteTask={() => {}} /> */}
        </Grid>
      </Grid>
    </Slide>
  );
};

HardChoices.propTypes = {
  taskId: PropTypes.string.isRequired,
};

const TroublesChoices = ({ postponeTask }) => {
  const [t] = useTranslation();
  const { pathname } = useLocation();
  function postPone() {
    postponeTask(1, t('Posponed until tomorrow'), 'default');
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
  postponeTask: PropTypes.func.isRequired,
};

const TaskActions = props => {
  const [t] = useTranslation();
  const classes = useStyles();
  const { pathname } = useLocation();
  const didGood = () => props.postponeTask(1, t('Good job!'));
  const didGreat = () => props.postponeTask(3, t('Good job!'));
  return (
    <Fade in timeout={1200}>
      <Grid container direction="column" classes={{ root: props.className }}>
        <Grid item xs align="center">
          <Button component={Link} to={`${pathname}/isTroublesome`}>
            Есть трудности
          </Button>
        </Grid>
        <Grid item xs align="center">
          <Button onClick={didGood}>Сделал шаг вперед</Button>
        </Grid>
        <Grid item xs align="center">
          <Button onClick={didGreat}>Сильно продвинулся</Button>
        </Grid>
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
    </Fade>
  );
};

TaskActions.propTypes = {
  className: PropTypes.string,
  setDone: PropTypes.func.isRequired,
  postponeTask: PropTypes.func.isRequired,
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
