import React from 'react';
import Grid from '@material-ui/core/Grid';
import RewardsList from '../components/rewards/RewardsList';
import CreateReward from '../components/rewards/CreateReward';
import { useTypedSelector } from '../store/index';
import get from 'lodash/get';
import { useFirestoreConnect } from 'react-redux-firebase';
import { Reward } from '../store/rewardsSlice';

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
    <Grid container>
      <Grid item xs={12}>
        <CreateReward />
      </Grid>
      <Grid item xs={12}>
        <RewardsList values={rewards} />
      </Grid>
    </Grid>
  );
};

export default RewardsPage;
