import React, { memo } from 'react';
import { Grid, Typography } from '@material-ui/core';
import { UpsertDailyGoal } from '../../components/unsorted/UpsertDailyGoal';
import { DayliGoalsList } from '../../components/unsorted/DayliGoalsList';

export const StreaksPage = memo((props) => (
  <Grid container>
    <Grid xs={12}>
      <Typography variant="h1">
        This page is a Work In Progress.
      </Typography>
    </Grid>
    <Grid xs={12}>
      <UpsertDailyGoal />
    </Grid>
    <Grid xs={12}>
      <DayliGoalsList goals={[]} />
    </Grid>
  </Grid>
  ));
