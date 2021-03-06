import { Theme, Typography } from '@material-ui/core';
import Button, { ButtonProps } from '@material-ui/core/Button';
import Fade from '@material-ui/core/Fade';
import Grid from '@material-ui/core/Grid';
import AssigmentIcon from '@material-ui/icons/Assignment';
import DoneIcon from '@material-ui/icons/Done';
import HeartIcon from '@material-ui/icons/Favorite';
import SmileEmoticon from '@material-ui/icons/TagFaces';
import { makeStyles } from '@material-ui/styles';
import filter from 'lodash/filter';
import get from 'lodash/get';
import map from 'lodash/map';
import head from 'ramda/es/head';
import React from 'react';
import { When } from 'react-if';
import { TaskPageGridWidth } from '../../../pages/TaskPage';
import { updateTaskParams } from '../../../pages/TaskPage/TaskPageContainer';
import {
  calculateNextRepetition,
  Confidence,
  distanceBetweenDates,
  useTypedTranslate,
} from '../../../services/index';
import Snackbar from '../../../services/Snackbar';
import { Task } from '../../../entities/Task';
import { Subtask } from '../../../entities/Subtask';

const useStyles = makeStyles((theme: Theme) => ({
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

const PositiveChoices = (props: Props) => {
  const t = useTypedTranslate();
  const classes = useStyles();
  const activeSubtasks =
    filter(props.task.subtasks, (i) => !i.isDone) || [];
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
    props
      .updateTask({
        values: {
          isCurrent: false,
          ...nextRepetition,
        },
        history: {
          taskId: props.task.id,
          userId: props.task.userId,
          createdAt: Date.now(),
          // @ts-ignore
          actionType:
            confidence === 'normal' ? 'stepForward' : 'leapForward',
        },
        pointsToAdd: confidence === 'normal' ? 10 : 20,
        snackbarMessage: t('important to step forward'),
      })
      .then(() => {
        Snackbar.addToQueue(
          t('you will see task again in', {
            date: distanceBetweenDates(
              nextRepetition.dueAt,
              new Date(),
            ),
          }),
        );
      });
  }

  function doneTask() {
    const rewardPerSubtask = 10;
    const repetitionLevel = get(props, 'task.repetitionLevel') || 1;
    const pointsToAdd =
      20 * repetitionLevel + activeSubtasks.length * rewardPerSubtask;
    props.updateTask({
      pointsToAdd,
      snackbarMessage: '',
      values: {
        isCurrent: false,
        isDone: true,
        doneAt: Date.now(),
      },
      history: {
        taskId: props.task.id,
        userId: props.task.userId,
        createdAt: Date.now(),
        actionType: 'setDone',
      },
    });
  }

  function doneSubtask() {
    const pointsToAdd = 10;
    props.updateTask({
      pointsToAdd,
      snackbarMessage: t('Good job!'),
      history: {
        taskId: props.task.id,
        createdAt: Date.now(),
        userId: props.task.userId,
        actionType: 'doneSubtask',
      },
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

export default PositiveChoices;
