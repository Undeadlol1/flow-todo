import isUndefined from 'lodash/isUndefined';
import React, { memo } from 'react';
import { Reward } from '../../store/rewardsSlice';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import Box from '@material-ui/core/Box';
import Skeleton from '@material-ui/lab/Skeleton';
import nanoid from 'nanoid';
import isNull from 'lodash/isNull';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
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
  if (isNull(rewards)) return null;
  if (isUndefined(rewards))
    return (
      <Box width="100%">
        {Array.from({ length: 4 }, () => (
          <Skeleton
            key={nanoid()}
            component={Box}
            height="100px"
            variant="rect"
            className={cx.card}
          />
        ))}
      </Box>
    );
  else
    return (
      <Box width="100%">
        {rewards.map(r => (
          <Card key={r.id} className={cx.card}>
            <CardHeader title={r.name} subheader={r.points} />
          </Card>
        ))}
      </Box>
    );
};

export default memo(RewardsList);
