import React from 'react';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import CreateTask from '../components/tasks/CreateTask/CreateTask';
import RandomTaskButton from '../components/tasks/RandomTaskButton/RandomTaskButton';
import TasksList from '../components/tasks/TasksList/TasksList';

const useStyles = makeStyles({
  CreateTask: {},
  Button: {
    marginTop: '50px',
  },
});

export default function HomePage() {
  const classes = useStyles();
  return (
    <Grid
      container
      justify="center"
      direction="column"
      alignItems="stretch"
      alignContent="center"
    >
      <Grid item xs={12} sm={12} align="center">
        <CreateTask />
      </Grid>
      <Grid item xs={12} sm={8} md={8} lg={6} align="center">
        <RandomTaskButton className={classes.Button} />
      </Grid>
      <Grid item xs={12} sm={8} md={8} lg={6} align="center">
        <TasksList />
      </Grid>
    </Grid>
  );
}
