import React from 'react';
import Grid from '@material-ui/core/Grid';
import RewardsList from '../components/rewards/RewardsList';
import CreateReward from '../components/rewards/CreateReward';
import { useTypedSelector } from '../store/index';
import get from 'lodash/get';
import { useFirestoreConnect } from 'react-redux-firebase';
import { Reward } from '../store/rewardsSlice';
import Box from '@material-ui/core/Box';

interface Props {}

const RewardsPage: React.FC<Props> = () => {
  const userId = useTypedSelector(s =>
    get(s, 'firebase.auth.uid', ''),
  );
  const rewards = useTypedSelector(
    s => s.firestore.ordered.rewards as Reward[],
  );
  useFirestoreConnect([
    {
      collection: 'rewards',
      where: [['userId', '==', userId]],
      // where: [['userId', '==', userId], ['isDone', '==', false]],
    },
  ]);

  return (
    <Box>
      <Grid container justify="center" spacing={2}>
        <Grid item xs={12} sm={8} md={8} lg={6}>
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

export default RewardsPage;
