import { Box, Button, ButtonProps } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
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
    ViewerController.rewardPoints(points).then(() =>
      Snackbar.addToQueue(t('youAreCloserToYourGoal')),
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
            <TypicalParagraph>
              {t('any task can be split')}
            </TypicalParagraph>
            <TypicalParagraph>
              {t('simplest thing to do?')}
            </TypicalParagraph>
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
            <TypicalParagraph>
              {t('sometimes you need to gather your thouthgs')}
            </TypicalParagraph>
          </UpsertNote>
        </Collapsible>
      </Grid>
      <Grid item xs={12}>
        <Collapsible title={t('Rework task')}>
          <>
            <TypicalParagraph>
              {t('reformulating is a good idea')}
            </TypicalParagraph>
            <TypicalParagraph>
              {t('how to formulate a task?')}
            </TypicalParagraph>
            <UpsertTask
              task={task}
              resetFormOnSuccess={false}
              afterSubmit={addPointsOnSuccess}
              defaultValue={props.task!.name}
            />
          </>
        </Collapsible>
      </Grid>
      <Grid item xs={12}>
        <Collapsible title={t('add a tag')}>
          <>
            <TypicalParagraph>
              {t('add tags to categorize')}
            </TypicalParagraph>
            <TypicalParagraph>{t('tagsExample')}</TypicalParagraph>
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

function TypicalParagraph(props: { children: string }) {
  return (
    <Typography paragraph variant="body2" color="textSecondary">
      {props.children}
    </Typography>
  );
}

export default NegativeChoices;
