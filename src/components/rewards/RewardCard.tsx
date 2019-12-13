import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import React, { memo } from 'react';
import { Reward } from '../../store/rewardsSlice';

const useStyles = makeStyles(theme => ({
  card: {
    width: '100%',
    margin: theme.spacing(2, 0),
  },
}));

interface Props {
  reward?: Reward;
  className?: string;
}

const RewardCard: React.FC<Props> = ({ reward, className }) => {
  const cx = useStyles();
  if (!reward) return null;
  return (
    <Box component={Card} className={clsx(cx.card, className)}>
      <CardHeader title={reward.name} subheader={reward.points} />
    </Box>
  );
};

export default memo(RewardCard);
