import React from 'react';
import Grid from '@material-ui/core/Grid';
import CreateSubtask from './CreateSubtask/CreateSubtask';
import SubtasksList from './SubtasksList';
import { makeStyles } from '@material-ui/core/styles';
import UpsertTask from './CreateTask/UpsertTask';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import { CardContent } from '@material-ui/core';
import { addPoints, Task } from '../../store/index';
import { UserInfo } from 'firebase';
import get from 'lodash/get';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { showSnackbar } from '../../services/index';

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
  const [t] = useTranslation();
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
    <Grid item container xs justify="center" spacing={2}>
      <Grid item xs={12} sm={8} md={6} lg={5}>
        <Card>
          <CardContent>
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
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={8} md={6} lg={5}>
        <Card>
          <CardContent>
            <Typography paragraph>
              Иногда переформулировать задачу - самое верное решение.
            </Typography>
            <Typography paragraph>
              Как сформулировать задачу чтобы проще было ее выполнить?
            </Typography>
            <UpsertTask
              taskId={props.taskId}
              defaultValue={props.task!.name}
              resetFormOnSuccess={false}
              showSnackbarOnSuccess={false}
              callback={addPointsOnSuccess}
            />
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default HardChoices;
