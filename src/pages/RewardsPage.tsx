import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import React, { memo } from 'react';
import CreateReward from '../components/rewards/CreateReward';
import RewardsList from '../components/rewards/RewardsList';
import { useTypedSelector } from '../store/index';
import { Reward } from '../store/rewardsSlice';

interface Props {}

const RewardsPage: React.FC<Props> = () => {
  const rewards = useTypedSelector(
    s => s.firestore.ordered.rewards as Reward[],
  );

  return (
    <Box>
      <Grid container justify="center" spacing={2}>
        <Grid
          component={Box}
          mt={2}
          item
          xs={12}
          sm={8}
          md={8}
          lg={6}
        >
          <CreateReward />
        </Grid>
      </Grid>
      <Grid container>
        <Grid container item xs={12} sm={8} md={8} lg={6}>
          <RewardsList values={rewards} />
        </Grid>
      </Grid>
    </Box>
  );
};

export default memo(RewardsPage);
