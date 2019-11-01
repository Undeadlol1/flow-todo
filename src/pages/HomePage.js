import React from 'react';
import Grid from '@material-ui/core/Grid';
import CreateTask from '../components/tasks/CreateTask/CreateTask';
import RandomTaskButton from '../components/tasks/RandomTaskButton/RandomTaskButton';

export default function HomePage() {
  return (
    <Grid
      container
      spacing={4}
      justify="center"
      direction="column"
      alignItems="center"
    >
      <Grid item xs={12} sm={12} align="center">
        <CreateTask />
      </Grid>
      <Grid item xs={12} sm={8} md={4} lg={4} align="center">
        <RandomTaskButton />
      </Grid>
    </Grid>
  );
}
