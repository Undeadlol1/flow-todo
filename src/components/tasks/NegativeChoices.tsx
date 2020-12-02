import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/styles';
import Typography, {
  TypographyProps,
} from '@material-ui/core/Typography';
import get from 'lodash/get';
import React from 'react';
import { Box, Button, ButtonProps, Theme } from '@material-ui/core';
import { TaskPageGridWidth } from '../../pages/TaskPage';
import {
  showSnackbar,
  useTypedTranslate,
} from '../../services/index';
import { useTypedSelector } from '../../store/index';
import { Task } from '../../entities/Task';
import { addPointsToUser } from '../../repositories/addPointsToUser';
import { authSelector } from '../../store/selectors';
import Collapsible from '../ui/Collapsible';
import CreateSubtask from './CreateSubtask/CreateSubtask';
import UpsertTask from './CreateTask/UpsertTask';
import SubtasksList from './SubtasksList';
import UpsertNote from './UpsertNote/UpsertNote';
import TagsForm from './TagsForm';

const useStyles = makeStyles((theme: Theme) => ({
  form: {
    marginBottom: theme.spacing(1),
  },
}));
const paragraphProps: TypographyProps = {
  paragraph: true,
  variant: 'body2',
  color: 'textSecondary',
};

const NegativeChoices = (props: {
  task: Task;
  taskId: string;
  deleteTask: () => Promise<void>;
}) => {
  const t = useTypedTranslate();
  const classes = useStyles();
  const { task, taskId } = props;
  const taskNote = get(task, 'note');
  const auth = useTypedSelector(authSelector);

  const commonButtonProps: ButtonProps = {
    fullWidth: true,
    color: 'primary',
    variant: 'contained',
  };

  function addPointsOnSuccess(points = 10) {
    addPointsToUser(auth.uid, points);
    showSnackbar(
      t('youAreCloserToYourGoal', {
        points,
      }),
    );
  }

  return (
    <Grid item container {...TaskPageGridWidth} justify="center">
      <Grid item xs={12}>
        <Collapsible
          title={t('reject_the_task')}
          isOpen={Boolean(get(task, 'subtasks.length'))}
        >
          <>
            <Grid item xs={12}>
              <Typography paragraph>
                {t('dont_hesitate_to_push_this_button')}
              </Typography>
              <Typography paragraph>
                {t('only_20_percent_gives_results')}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Box mb={2}>
                <Button
                  {...commonButtonProps}
                  onClick={props.deleteTask}
                >
                  {t('notImportant')}
                </Button>
              </Box>
            </Grid>
          </>
        </Collapsible>
      </Grid>
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
        <Collapsible
          title={t(taskNote ? 'Edit the note' : 'Add a note')}
        >
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
      <Grid item xs={12}>
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
      </Grid>
    </Grid>
  );
};

export default NegativeChoices;
