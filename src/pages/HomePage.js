import React from 'react';
import Grid from '@material-ui/core/Grid';
import CreateTask from '../components/tasks/CreateTask/CreateTask';
import { TasksListContainer } from '../components/tasks/TasksList/TasksList';

export default function HomePage() {
  return (
    <Grid
      container
      direction="row"
      justify="center"
      alignItems="center"
    >
      <Grid item xs={12} align="center">
        <CreateTask />
      </Grid>
      <Grid item xs={12} sm={8} md={4} lg={4} align="center">
        <TasksListContainer />
      </Grid>
    </Grid>
  );
}
