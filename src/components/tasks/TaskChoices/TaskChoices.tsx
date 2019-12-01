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
import get from 'lodash/get';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';
import {
  calculateNextRepetition,
  Confidence,
} from '../../../services';
import {
  distanceBetweenDates,
  showSnackbar,
} from '../../../services/index';
import { Task } from '../../../store/index';
import { updateTaskParams } from '../../../pages/TaskPage/TaskPageContainer';

const useStyles = makeStyles(theme => ({
  container: {
    textAlign: 'center',
  },
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
  updateSubtask: Function;
  updateTask: (options: updateTaskParams) => Promise<void>;
}

const TaskChoices = (props: Props) => {
  const [t] = useTranslation();
  const classes = useStyles();
  const { pathname } = useLocation();
  const activeSubtasks = filter(props.task.subtasks, i => !i.isDone);
  const hasSubtasks = Boolean(activeSubtasks.length);
  const commonButtonProps: ButtonProps = {
    color: 'primary',
    variant: 'contained',
    className: classes.button,
    fullWidth: true,
  };
  const commonGridProps: any = {
    item: true,
    xs: 12,
    sm: 8,
    md: 6,
    lg: 4,
    style: { margin: '0 auto' },
  };

  function stepForward(confidence: Confidence, pointsToAdd?: number) {
    const nextRepetition = calculateNextRepetition(
      props.task,
      confidence,
    );
    props.updateTask({
      values: {
        isCurrent: false,
        ...nextRepetition,
      },
      snackbarMessage: t('important to step forward'),
    });
    setTimeout(
      () =>
        showSnackbar(
          t('you will see task again in', {
            date: distanceBetweenDates(
              nextRepetition.dueAt,
              new Date(),
            ),
          }),
        ),
      4000,
    );
  }

  const setDone = hasSubtasks
    ? () => props.updateSubtask(activeSubtasks[0])
    : () => {
        const pointsToAdd =
          20 * (get(props, 'task.repetitionLevel') || 1);
        props.updateTask({
          pointsToAdd,
          values: {
            isCurrent: false,
            isDone: true,
            doneAt: Date.now(),
          },
          snackbarMessage: t('goodJobPointsRecieved', {
            points: pointsToAdd,
          }),
        });
      };
  return (
    <Fade in timeout={1200}>
      <Grid
        container
        direction="row"
        alignContent="space-around"
        className={classes.container}
        classes={{ root: props.className }}
      >
        <Grid {...commonGridProps}>
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
        <Grid {...commonGridProps}>
          <Button
            {...commonButtonProps}
            startIcon={<HeartIcon />}
            onClick={() => stepForward('normal')}
          >
            {t('made step forward')}
          </Button>
        </Grid>
        <Grid {...commonGridProps}>
          <Button
            {...commonButtonProps}
            startIcon={<SmileEmoticon />}
            onClick={() => stepForward('good', 30)}
          >
            {t('advanced a lot')}
          </Button>
        </Grid>
        <Grid
          container
          direction="column"
          classes={{ root: props.className }}
        >
          <Grid {...commonGridProps}>
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
