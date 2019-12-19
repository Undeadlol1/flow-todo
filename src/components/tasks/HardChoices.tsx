import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import Typography, {
  TypographyProps,
} from '@material-ui/core/Typography';
import get from 'lodash/get';
import React from 'react';
import { TaskPageGridWidth } from '../../pages/TaskPage';
import {
  showSnackbar,
  useTypedTranslate,
} from '../../services/index';
import { addPoints, Task, useTypedSelector } from '../../store/index';
import { authSelector } from '../../store/selectors';
import Collapsible from './../ui/Collapsible';
import CreateSubtask from './CreateSubtask/CreateSubtask';
import UpsertTask from './CreateTask/UpsertTask';
import SubtasksList from './SubtasksList';
import UpsertNote from './UpsertNote/UpsertNote';

const useStyles = makeStyles(theme => ({
  form: {
    marginBottom: theme.spacing(1),
  },
}));
const paragraphProps: TypographyProps = {
  paragraph: true,
  variant: 'body2',
  color: 'textSecondary',
};

const HardChoices = (
  props: Partial<{
    task: Task;
    taskId: string;
  }>,
) => {
  const t = useTypedTranslate();
  const classes = useStyles();
  const { task, taskId } = props;
  const taskNote = get(task, 'note');
  const auth = useTypedSelector(authSelector);
  const addPointsOnSuccess = (points = 10) => {
    addPoints(auth.uid, points);
    showSnackbar(
      t('youAreCloserToYourGoal', {
        points,
      }),
    );
  };

  return (
    <Grid item container {...TaskPageGridWidth} justify="center">
      <Grid item xs={12}>
        <Collapsible
          title={t('Add subtasks')}
          isOpen={Boolean(get(task, 'subtasks.length'))}
        >
          <>
            <Typography {...paragraphProps}>
              {t('any task can be split')}
            </Typography>
            <Typography {...paragraphProps}>
              {t('simplest thing to do?')}
            </Typography>
            <CreateSubtask
              className={classes.form}
              taskId={props.taskId as string}
              callback={() => addPointsOnSuccess(5)}
            />
            <SubtasksList documents={props.task!.subtasks} />
          </>
        </Collapsible>
      </Grid>
      <Grid item xs={12}>
        <Collapsible title={t(taskNote ? 'A note' : 'Add a note')}>
          <UpsertNote
            taskId={taskId as string}
            defaultValue={taskNote}
          >
            <Typography {...paragraphProps}>
              {t('sometimes you need to gather your thouthgs')}
            </Typography>
          </UpsertNote>
        </Collapsible>
      </Grid>
      <Grid item xs={12}>
        <Collapsible title={t('Rework task')}>
          <>
            <Typography {...paragraphProps}>
              {t('reformulating is a good idea')}
            </Typography>
            <Typography {...paragraphProps}>
              {t('how to formulate a task?')}
            </Typography>
            <UpsertTask
              taskId={props.taskId}
              defaultValue={props.task!.name}
              resetFormOnSuccess={false}
              showSnackbarOnSuccess={false}
              callback={addPointsOnSuccess}
            />
          </>
        </Collapsible>
      </Grid>
      {/* <Grid item xs={12}>
        <Collapsible title={t('add a tag')}>
          <>
            <Typography {...paragraphProps}>
              {t('add tags to categorize')}
            </Typography>
            <Typography {...paragraphProps}>
              {t('tagsExample')}
            </Typography>
            <TagsForm
              tags={get(props, 'task.tags')}
              taskId={props.taskId as string}
            />
          </>
        </Collapsible>
      </Grid> */}
    </Grid>
  );
};

export default HardChoices;
