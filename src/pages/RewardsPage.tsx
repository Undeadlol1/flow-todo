import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import React, { memo } from 'react';
import CreateReward from '../components/rewards/CreateReward';
import RewardsList from '../components/rewards/RewardsList';
import { useTypedSelector } from '../store/index';
import { Reward } from '../store/rewardsSlice';
import debug from 'debug';
import { makeStyles } from '@material-ui/core';

const log = debug('RewardsPage');
const useStyles = makeStyles(theme => ({
  pageContainer: {
    marginTop: 0,
    marginBottom: 0,
    minHeight: 'calc(100vh - 74px)',
  },
}));

interface Props {}

const RewardsPage: React.FC<Props> = () => {
  const cx = useStyles();
  const rewards = useTypedSelector(
    s => s.firestore.ordered.rewards as Reward[],
  );
  log('rewards: %O', rewards);

  return (
    <Box className={cx.pageContainer}>
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
      <Grid container justify="center">
        <Grid container item xs={12} sm={8} md={8} lg={6}>
          <RewardsList values={rewards} />
        </Grid>
      </Grid>
    </Box>
  );
};

export default memo(RewardsPage);
