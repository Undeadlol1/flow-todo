import { Box, Button, ButtonProps } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import Typography, {
  TypographyProps,
} from '@material-ui/core/Typography';
import get from 'lodash/get';
import React from 'react';
import { ViewerController } from '../../controllers/ViewerController';
import { Task } from '../../entities/Task';
import { TaskPageGridWidth } from '../../pages/TaskPage';
import { useTypedTranslate } from '../../services/index';
import Snackbar from '../../services/Snackbar';
import Collapsible from '../ui/Collapsible';
import CreateSubtask from './CreateSubtask/CreateSubtask';
import UpsertTask from './CreateTask/UpsertTask';
import SubtasksList from './SubtasksList';
import TagsForm from './TagsForm';
import UpsertNote from './UpsertNote/UpsertNote';

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
  const { task, taskId } = props;
  const taskNote = get(task, 'note');

  const commonButtonProps: ButtonProps = {
    fullWidth: true,
    color: 'primary',
    variant: 'contained',
  };

  function addPointsOnSuccess(points = 10) {
    ViewerController.rewardPoints(points);
    Snackbar.addToQueue(t('youAreCloserToYourGoal'));
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
              taskId={props.taskId as string}
              callback={() => addPointsOnSuccess(5)}
            />
            <Box height={1} />
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
