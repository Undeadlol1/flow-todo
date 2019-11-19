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
import Fade from '@material-ui/core/Fade';
import filter from 'lodash/filter';
import AssigmentIcon from '@material-ui/icons/Assignment';
import { calculateNextRepetition } from '../../../services';
import HardChoices from '../HardChoices';
import TroublesChoices from '../TroubledChoices';

const useStyles = makeStyles(theme => ({
  button: {
    margin: theme.spacing(1),
  },
  doneButton: {
    marginTop: '30px',
  },
}));

const TaskActions = props => {
  const [t] = useTranslation();
  const classes = useStyles();
  const { pathname } = useLocation();
  const activeSubtasks = filter(props.task.subtasks, i => !i.isDone);
  const hasSubtasks = Boolean(activeSubtasks.length);
  const commonButtonProps = {
    color: 'primary',
    variant: 'contained',
    className: classes.button,
  };
  const didGood = () => props.updateTask(
      {
        isCurrent: false,
        ...calculateNextRepetition(props.task, 'normal'),
      },
      t('Good job!'),
    );
  const didGreat = () => props.updateTask(
      {
        isCurrent: false,
        ...calculateNextRepetition(props.task, 'good'),
      },
      t('Good job!'),
    );
  const setDone = hasSubtasks
    ? () => props.updateSubtask(activeSubtasks[0])
    : () => props.updateTask(
          { isCurrent: false, isDone: true, doneAt: Date.now() },
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
            {...commonButtonProps}
            color="secondary"
            component={Link}
            startIcon={<ErrorIcon />}
            to={`${pathname}/isTroublesome`}
          >
            {t('there are difficulties')}
          </Button>
        </Grid>
        <Grid item xs align="center">
          <Button
            {...commonButtonProps}
            startIcon={<HeartIcon />}
            onClick={didGood}
          >
            {t('made step forward')}
          </Button>
        </Grid>
        <Grid item xs align="center">
          <Button
            {...commonButtonProps}
            startIcon={<SmileEmoticon />}
            onClick={didGreat}
          >
            {t('advanced a lot')}
          </Button>
        </Grid>
        <Grid item xs align="center">
          <Button
            {...commonButtonProps}
            className={classes.doneButton}
            startIcon={(
              <>
                {hasSubtasks && <AssigmentIcon />}
                <DoneIcon />
              </>
            )}
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
  updateSubtask: PropTypes.func.isRequired,
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
