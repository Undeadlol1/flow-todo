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
    <Grid
      item
      container
      xs={12}
      sm={8}
      md={6}
      lg={5}
      justify="center"
    >
      <Grid item xs={12}>
        <Collapsible title={t('Add subtasks')}>
          <>
            <Typography paragraph>
              Любая задача, даже самая малая, может быть разбита на
              подзадачи.
            </Typography>
            <Typography paragraph>
              Что самое простое ты можешь сделать чтобы сдвинуться с
              места?
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
        <Collapsible title={t('Rework task')}>
          <>
            <Typography display="block" paragraph>
              Иногда переформулировать задачу - самое верное решение.
            </Typography>
            <Typography display="block" paragraph>
              Как сформулировать задачу чтобы проще было ее выполнить?
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
    </Grid>
  );
};

export default HardChoices;
