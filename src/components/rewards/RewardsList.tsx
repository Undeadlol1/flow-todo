import isUndefined from 'lodash/isUndefined';
import React, { memo } from 'react';
import { Reward } from '../../store/rewardsSlice';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import Box from '@material-ui/core/Box';
import Skeleton from '@material-ui/lab/Skeleton';
import nanoid from 'nanoid';
import isNull from 'lodash/isNull';

interface Props {
  values?: Reward[];
}

const RewardsList: React.FC<Props> = ({ values: rewards }) => {
  if (isNull(rewards)) return null;
  if (isUndefined(rewards))
    return (
      <Box width="100%">
        {Array.from({ length: 4 }, () => (
          <Box my={2} key={nanoid()}>
            <Skeleton width="100%" height="200px" variant="rect" />
          </Box>
        ))}
      </Box>
    );
  else
    return (
      <div>
        {rewards.map(r => (
          <Box key={r.id} my={2}>
            <Card key={r.id}>
              <CardHeader title={r.name} subheader={r.points} />
            </Card>
          </Box>
        ))}
      </div>
    );
};

export default memo(RewardsList);
