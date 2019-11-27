import Button from '@material-ui/core/Button';
import Fade from '@material-ui/core/Fade';
import Grid from '@material-ui/core/Grid';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import AssigmentIcon from '@material-ui/icons/Assignment';
import DoneIcon from '@material-ui/icons/Done';
import ErrorIcon from '@material-ui/icons/Error';
import HeartIcon from '@material-ui/icons/Favorite';
import SmileEmoticon from '@material-ui/icons/TagFaces';
import filter from 'lodash/filter';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import PropTypes from 'prop-types';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';
import { calculateNextRepetition } from '../../../services';

const useStyles = makeStyles(theme => ({
  button: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  doneButton: {
    marginTop: '30px',
  },
}));

const TaskChoices = props => {
  const [t] = useTranslation();
  const classes = useStyles();
  const { pathname } = useLocation();
  const theme = useTheme();
  const isScreenNarrow = useMediaQuery(theme.breakpoints.down('xs'));
  const activeSubtasks = filter(props.task.subtasks, i => !i.isDone);
  const hasSubtasks = Boolean(activeSubtasks.length);
  const commonButtonProps = {
    color: 'primary',
    variant: 'contained',
    className: classes.button,
    fullWidth: isScreenNarrow,
  };
  const didGood = () => props.updateTask(
      {
        isCurrent: false,
        ...calculateNextRepetition(props.task, 'normal'),
      },
      t('important to step forward'),
      undefined,
      10,
    );
  const didGreat = () => props.updateTask(
      {
        isCurrent: false,
        ...calculateNextRepetition(props.task, 'good'),
      },
      t('important to step forward'),
      undefined,
      30,
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
        direction="row"
        alignContent="space-around"
        classes={{ root: props.className }}
      >
        <Grid item xs={12} md={4} align="center">
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
        <Grid item xs={12} md={4} align="center">
          <Button
            {...commonButtonProps}
            startIcon={<HeartIcon />}
            onClick={didGood}
          >
            {t('made step forward')}
          </Button>
        </Grid>
        <Grid item xs={12} md={4} align="center">
          <Button
            {...commonButtonProps}
            startIcon={<SmileEmoticon />}
            onClick={didGreat}
          >
            {t('advanced a lot')}
          </Button>
        </Grid>
        <Grid
          container
          direction="column"
          classes={{ root: props.className }}
        >
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
      </Grid>
    </Fade>
  );
};

TaskChoices.propTypes = {
  className: PropTypes.string,
  task: PropTypes.object.isRequired,
  updateTask: PropTypes.func.isRequired,
  updateSubtask: PropTypes.func.isRequired,
};

export default TaskChoices;
