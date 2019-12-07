import React from 'react';
import Grid from '@material-ui/core/Grid';
import RewardsList from '../components/rewards/RewardsList';

interface Props {}

const RewardsPage: React.FC<Props> = () => {
  return (
    <Grid container>
      <Grid item xs>
        <RewardsList />
      </Grid>
    </Grid>
  );
};

export default RewardsPage;
