import React from 'react';
import Grid from '@material-ui/core/Grid';
import CreateSubtask from './CreateSubtask/CreateSubtask';
import SubtasksList from './SubtasksList';
import { makeStyles } from '@material-ui/core/styles';
import CreateTask from './CreateTask/UpsertTask';

const useStyles = makeStyles(theme => ({
  form: {
    marginBottom: theme.spacing(1)
  },
}));

const HardChoices = (props: {
  taskId: string;
  task: { name: string, subtasks: any };
}) => {
  const classes = useStyles();
  return (
    <>
      <Grid item xs={12} sm={8} md={6} lg={5}>
        <CreateTask taskId={props.taskId} defaultValue={props.task.name} />
      </Grid>
      <Grid item xs={12} sm={12} md={12} lg={12} />
      <Grid item xs={12} sm={8} md={6} lg={5}>
        <CreateSubtask
          taskId={props.taskId}
          className={classes.form}
        />
        <SubtasksList documents={props.task.subtasks} />
      </Grid>
    </>
  );
};

export default HardChoices;
