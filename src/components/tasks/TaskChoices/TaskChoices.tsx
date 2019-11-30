import Button, { ButtonProps } from '@material-ui/core/Button';
import Fade from '@material-ui/core/Fade';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import AssigmentIcon from '@material-ui/icons/Assignment';
import DoneIcon from '@material-ui/icons/Done';
import ErrorIcon from '@material-ui/icons/Error';
import HeartIcon from '@material-ui/icons/Favorite';
import SmileEmoticon from '@material-ui/icons/TagFaces';
import filter from 'lodash/filter';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';
import { Task } from '../../../store/index';
import {
  calculateNextRepetition,
  useScreenIsNarrow,
} from '../../../services';

const useStyles = makeStyles(theme => ({
  button: {
    margin: `${theme.spacing(1)}px auto`,
  },
  doneButton: {
    marginTop: '30px',
  },
}));

interface Props {
  task: Task;
  className?: string;
  updateTask: Function;
  updateSubtask: Function;
}

const TaskChoices = (props: Props) => {
  const [t] = useTranslation();
  const classes = useStyles();
  const { pathname } = useLocation();
  const activeSubtasks = filter(props.task.subtasks, i => !i.isDone);
  const hasSubtasks = Boolean(activeSubtasks.length);
  const isScreenNarrow = useScreenIsNarrow();
  const commonButtonProps: ButtonProps = {
    color: 'primary',
    variant: 'contained',
    className: classes.button,
    fullWidth: isScreenNarrow,
  };
  const didGood = () =>
    props.updateTask({
      values: {
        isCurrent: false,
        ...calculateNextRepetition(props.task, 'normal'),
      },
      snackbarMessage: t('important to step forward'),
    });
  const didGreat = () =>
    props.updateTask({
      valus: {
        isCurrent: false,
        ...calculateNextRepetition(props.task, 'good'),
      },
      message: t('important to step forward'),
      pointsToAdd: 30,
    });
  const setDone = hasSubtasks
    ? () => props.updateSubtask(activeSubtasks[0])
    : () =>
        props.updateTask({
          values: {
            isCurrent: false,
            isDone: true,
            doneAt: Date.now(),
          },
          snackbarMessage: t('Good job!'),
        });
  return (
    <Fade in timeout={1200}>
      <Grid
        container
        direction="row"
        alignContent="space-around"
        classes={{ root: props.className }}
      >
        <Grid item xs={12} md={4} style={{ margin: '0 auto' }}>
          {/*
          // @ts-ignore */}
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
        <Grid item xs={12} md={4}>
          <Button
            {...commonButtonProps}
            startIcon={<HeartIcon />}
            onClick={didGood}
          >
            {t('made step forward')}
          </Button>
        </Grid>
        <Grid item xs={12} md={4}>
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
          <Grid item xs>
            <Button
              {...commonButtonProps}
              className={classes.doneButton}
              startIcon={
                <>
                  {hasSubtasks && <AssigmentIcon />}
                  <DoneIcon />
                </>
              }
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

export default TaskChoices;
