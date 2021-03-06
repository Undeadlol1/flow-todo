import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/styles';
import Skeleton from '@material-ui/lab/Skeleton';
import get from 'lodash/get';
import isNull from 'lodash/isNull';
import isUndefined from 'lodash/isUndefined';
import React, { memo } from 'react';
import { Theme } from '@material-ui/core';
import { useTypedSelector } from '../../store/index';
import { Reward } from '../../store/rewardsSlice';
import RewardCard from './RewardCard';
import { getUniqueId } from '../../helpers/getUniqueId';

const useStyles = makeStyles((theme: Theme) => ({
  card: {
    width: '100%',
    margin: theme.spacing(2, 0),
  },
}));

interface Props {
  values?: Reward[];
}

const RewardsList: React.FC<Props> = ({ values: rewards }) => {
  const cx = useStyles();
  const profile = useTypedSelector((s) =>
    get(s, 'firebase.profile', {}),
  );

  if (isNull(rewards)) return null;
  if (isUndefined(rewards)) {
    return (
      <Box width="100%">
        {Array.from({ length: 4 }, () => (
          <Skeleton
            key={getUniqueId()}
            component={Box}
            height="100px"
            variant="rect"
            className={cx.card}
          />
        ))}
      </Box>
    );
  }
  return (
    <Box width="100%">
      {rewards.map((r) => (
        <RewardCard
          key={r.id}
          reward={r}
          className={cx.card}
          displayActions={profile.points >= r.points}
        />
      ))}
    </Box>
  );
};

export default memo(RewardsList);
