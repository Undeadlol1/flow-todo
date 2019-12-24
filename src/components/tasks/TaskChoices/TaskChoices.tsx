import { Typography } from '@material-ui/core';
import Button, { ButtonProps } from '@material-ui/core/Button';
import Fade from '@material-ui/core/Fade';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import AssigmentIcon from '@material-ui/icons/Assignment';
import DoneIcon from '@material-ui/icons/Done';
import HeartIcon from '@material-ui/icons/Favorite';
import SmileEmoticon from '@material-ui/icons/TagFaces';
import filter from 'lodash/filter';
import get from 'lodash/get';
import head from 'ramda/es/head';
import React from 'react';
import { When } from 'react-if';
import { TaskPageGridWidth } from '../../../pages/TaskPage';
import { updateTaskParams } from '../../../pages/TaskPage/TaskPageContainer';
import {
  calculateNextRepetition,
  Confidence,
} from '../../../services';
import {
  distanceBetweenDates,
  showSnackbar,
  useTypedTranslate,
} from '../../../services/index';
import { Task, Subtask } from '../../../store/index';
import map from 'lodash/map';

const useStyles = makeStyles(theme => ({
  container: {
    textAlign: 'center',
  },
  button: {
    margin: `${theme.spacing(1)}px auto`,
  },
}));

interface Props {
  task: Task;
  className?: string;
  updateTask: (options: updateTaskParams) => Promise<void>;
}

const TaskChoices = (props: Props) => {
  const t = useTypedTranslate();
  const classes = useStyles();
  const activeSubtasks =
    filter(props.task.subtasks, i => !i.isDone) || [];
  const hasSubtasks = Boolean(activeSubtasks.length);
  const commonButtonProps: ButtonProps = {
    fullWidth: true,
    color: 'primary',
    variant: 'contained',
    className: classes.button,
  };
  const commonGridProps: any = {
    item: true,
    xs: 12,
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
      history: {
        createdAt: Date.now(),
        // @ts-ignore
        actionType:
          confidence === 'normal' ? 'stepForwardA' : 'leapForward',
      },
      pointsToAdd: confidence === 'normal' ? 10 : 20,
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
  function doneTask() {
    const rewardPerSubtask = 10;
    const repetitionLevel = get(props, 'task.repetitionLevel') || 1;
    const pointsToAdd =
      20 * repetitionLevel + activeSubtasks.length * rewardPerSubtask;
    props.updateTask({
      pointsToAdd,
      values: {
        isCurrent: false,
        isDone: true,
        doneAt: Date.now(),
      },
      history: {
        createdAt: Date.now(),
        actionType: 'setDone',
      },
      snackbarMessage: t('goodJobPointsRecieved', {
        points: pointsToAdd,
      }),
    });
  }

  function doneSubtask() {
    const pointsToAdd = 10;
    props.updateTask({
      pointsToAdd,
      values: {
        ...calculateNextRepetition(props.task, 'normal'),
        subtasks: map(props.task!.subtasks, (t: Subtask) =>
          // @ts-ignore
          t.id === head(activeSubtasks || []).id
            ? { ...t, isDone: true, doneAt: Date.now() }
            : t,
        ),
        isCurrent: false,
      },
      history: {
        createdAt: Date.now(),
        actionType: 'updateSubtask',
      },
      snackbarMessage: t('goodJobPointsRecieved', {
        points: pointsToAdd,
      }),
    });
  }

  return (
    <Fade in timeout={1200}>
      <Grid
        container
        item
        {...TaskPageGridWidth}
        direction="row"
        alignContent="space-around"
        className={classes.container}
        classes={{ root: props.className }}
      >
        <Grid {...commonGridProps}>
          <Typography paragraph align="left">
            {t('if you spend atleast 5 minutes')}
          </Typography>
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
        <When condition={hasSubtasks}>
          <Grid {...commonGridProps}>
            <Button
              {...commonButtonProps}
              startIcon={<AssigmentIcon />}
              onClick={doneSubtask}
            >
              {t('done subtask')}
            </Button>
          </Grid>
        </When>
        <Grid {...commonGridProps}>
          <Button
            {...commonButtonProps}
            startIcon={<DoneIcon />}
            onClick={doneTask}
          >
            {t(hasSubtasks ? 'done task' : 'done')}
          </Button>
        </Grid>
      </Grid>
    </Fade>
  );
};

export default TaskChoices;
