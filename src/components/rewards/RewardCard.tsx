import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardHeader from '@material-ui/core/CardHeader';
import { makeStyles } from '@material-ui/styles';
import clsx from 'clsx';
import debug from 'debug';
import React, { memo } from 'react';
import { When } from 'react-if';
import CardMedia from '@material-ui/core/CardMedia';
import { Theme } from '@material-ui/core';
import { useTypedTranslate } from '../../services/index';
import { Reward } from '../../store/rewardsSlice';
import { claimReward } from '../../store';

const log = debug('RewardCard');
const useStyles = makeStyles((theme: Theme) => ({
  card: {
    width: '100%',
    margin: theme.spacing(2, 0),
  },
}));

interface Props {
  reward?: Reward;
  isRaised?: boolean;
  className?: string;
  displayActions?: boolean;
}

const RewardCard: React.FC<Props> = ({
  reward,
  displayActions,
  ...props
}) => {
  const t = useTypedTranslate();
  const cx = useStyles();
  log('reward: %O', reward);
  log('displayActions:', displayActions);

  if (!reward) return null;

  const hasImage = Boolean(reward.image);
  const shouldDisplayActions = Boolean(displayActions);
  return (
    <Card
      raised={props.isRaised}
      className={clsx(cx.card, props.className)}
    >
      <CardHeader title={reward.name} subheader={reward.points} />
      <When condition={hasImage}>
        <CardMedia component="img" src={reward.image} />
      </When>
      <When condition={shouldDisplayActions}>
        <CardActions>
          <Button onClick={() => claimReward(reward)}>
            {t('take')}
          </Button>
        </CardActions>
      </When>
    </Card>
  );
};

export default memo(RewardCard);
