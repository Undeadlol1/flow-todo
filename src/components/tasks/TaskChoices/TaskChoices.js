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
          <Button className={classes.button} color="primary" variant="contained" startIcon={<HeartIcon />} nClick={didGood}>Сделал шаг вперед</Button>
        </Grid>
        <Grid item xs align="center">
          <Button className={classes.button} color="primary" variant="contained" startIcon={<SmileEmoticon />} onClick={didGreat}>
            Сильно продвинулся
          </Button>
        </Grid>
        <Grid item xs align="center">
          <Button
            className={classes.doneButton}
            color="primary"
            variant="contained"
            startIcon={<DoneIcon />}
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
