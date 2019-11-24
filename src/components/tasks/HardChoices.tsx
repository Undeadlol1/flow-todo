import React from 'react';
import Grid from '@material-ui/core/Grid';
import CreateSubtask from './CreateSubtask/CreateSubtask';
import SubtasksList from './SubtasksList';
import { makeStyles } from '@material-ui/core/styles';
import UpsertTask from './CreateTask/UpsertTask';
import Card from '@material-ui/core/Card';

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
        <CreateSubtask
          className={classes.form}
          taskId={props.taskId as string}
        />
        <SubtasksList documents={props.task!.subtasks} />
      </Grid>
      <Grid item xs={12} sm={12} md={12} lg={12} />
      <Grid item xs={12} sm={8} md={6} lg={5}>
        <Card elevation={6}>
          <UpsertTask
            taskId={props.taskId}
            defaultValue={props.task!.name}
            resetFormOnSuccess={false}
            showSnackbarOnSuccess={false}
          />
        </Card>
      </Grid>
    </>
  );
};

export default HardChoices;
