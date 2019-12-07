import React, { memo } from 'react';
import { useTypedSelector } from '../../store/index';
import isUndefined from 'lodash/isUndefined';
import { Reward } from '../../store/rewardsSlice';

const RewardsList: React.FC<{}> = () => {
  const rewards = useTypedSelector(
    s => s.firestore.ordered.rewards as Reward[],
  );
  console.log('rewards: ', rewards);
  if (isUndefined(rewards)) return null;
  else
    return (
      <div>
        <ul>
          {rewards.map(r => (
            <li key={r.id}>{r.name}</li>
          ))}
        </ul>
      </div>
    );
};

export default memo(RewardsList);
