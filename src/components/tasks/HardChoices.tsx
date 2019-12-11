import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { UserInfo } from 'firebase';
import get from 'lodash/get';
import React from 'react';
import { useSelector } from 'react-redux';
import {
  showSnackbar,
  useTypedTranslate,
} from '../../services/index';
import { addPoints, Task } from '../../store/index';
import Collapsible from './../ui/Collapsible';
import CreateSubtask from './CreateSubtask/CreateSubtask';
import UpsertTask from './CreateTask/UpsertTask';
import SubtasksList from './SubtasksList';
import TagsForm from './TagsForm';
import isString from 'lodash/isString';
import UpsertNote from './UpsertNote/UpsertNote';
import { TaskPageGridWidth } from '../../pages/TaskPage';

const useStyles = makeStyles(theme => ({
  form: {
    marginBottom: theme.spacing(1),
  },
}));

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
  const auth: UserInfo = useSelector(s => get(s, 'firebase.auth'));
  const addPointsOnSuccess = () => {
    const points = 10;
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
        <Collapsible title={t('Add subtasks')}>
          <>
            <Typography paragraph>
              {t('any task can be split')}
            </Typography>
            <Typography paragraph>
              {t('simplest thing to do?')}
            </Typography>
            <CreateSubtask
              callback={addPointsOnSuccess}
              className={classes.form}
              taskId={props.taskId as string}
            />
            <SubtasksList documents={props.task!.subtasks} />
          </>
        </Collapsible>
      </Grid>
      <Grid item xs={12}>
        <Collapsible
          isOpen={isString(taskNote)}
          title={t(taskNote ? 'A note' : 'Add a note')}
        >
          <UpsertNote
            taskId={taskId as string}
            defaultValue={taskNote}
          />
        </Collapsible>
      </Grid>
      <Grid item xs={12}>
        <Collapsible title={t('Rework task')}>
          <>
            <Typography display="block" paragraph>
              {t('reformulating is a good idea')}
            </Typography>
            <Typography display="block" paragraph>
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
            <Typography paragraph>
              {t('add tags to categorize')}
            </Typography>
            <Typography paragraph>{t('tagsExample')}</Typography>
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

export default HardChoices;
