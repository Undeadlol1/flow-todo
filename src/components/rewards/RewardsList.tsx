import isUndefined from 'lodash/isUndefined';
import React, { memo } from 'react';
import { Reward } from '../../store/rewardsSlice';

interface Props {
  values?: Reward[];
}

const RewardsList: React.FC<Props> = ({ values: rewards }) => {
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
