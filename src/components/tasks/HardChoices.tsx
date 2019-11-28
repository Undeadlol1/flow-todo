import React from 'react';
import Grid from '@material-ui/core/Grid';
import CreateSubtask from './CreateSubtask/CreateSubtask';
import SubtasksList from './SubtasksList';
import { makeStyles } from '@material-ui/core/styles';
import UpsertTask from './CreateTask/UpsertTask';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import { CardContent } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  form: {
    marginBottom: theme.spacing(1),
  },
}));

const HardChoices = (
  props: Partial<{
    taskId: string;
    task: { name: string; subtasks?: any };
  }>,
) => {
  const classes = useStyles();

  return (
    <>
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
              className={classes.form}
              taskId={props.taskId as string}
            />
            <SubtasksList documents={props.task!.subtasks} />
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={12} md={12} lg={12} />
      <Grid item xs={12} sm={8} md={6} lg={5}>
        <Card>
          <CardContent>
            <UpsertTask
              taskId={props.taskId}
              defaultValue={props.task!.name}
              resetFormOnSuccess={false}
              showSnackbarOnSuccess={false}
            />
          </CardContent>
        </Card>
      </Grid>
    </>
  );
};

export default HardChoices;
