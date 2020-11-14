import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import clsx from 'clsx';
import get from 'lodash/get';
import findLast from 'ramda/es/findLast';
import React, { memo } from 'react';
import { useDispatch } from 'react-redux';
import { useTypedTranslate } from '../../services/index';
import { useTypedSelector } from '../../store';
import { Profile } from '../../entities/Profile';
import { Reward } from '../../store/rewardsSlice';
import { toggleRewardModal } from '../../store/uiSlice';
import RewardCard from './RewardCard';
import { claimReward } from '../../repositories/claimReward';

interface Props {
  isOpen: boolean;
  className?: string;
}

const RewardModal: React.FC<Props> = (props) => {
  const dispatch = useDispatch();
  const t = useTypedTranslate();
  const { profile }: { profile: Profile } = useTypedSelector(
    (s) => s.firestore.data,
  );
  const userPoints = get(profile, 'points', 0);
  const rewards = useTypedSelector(
    (s) => s.firestore.ordered.rewards as Reward[],
  );
  const unlockedReward = findLast(
    (i) => i.points <= userPoints,
    rewards || [],
  ) as Reward;

  function toggleModal() {
    dispatch(toggleRewardModal());
  }

  function takeReward() {
    toggleModal();
    claimReward(unlockedReward);
  }

  return (
    <Dialog
      open={props.isOpen}
      aria-labelledby="alert-dialog-title"
      className={clsx(props.className)}
      aria-describedby="alert-dialog-title"
      onClose={toggleModal}
    >
      <DialogTitle id="alert-dialog-title">
        {t('you unlocked a reward')}!
      </DialogTitle>
      <DialogContent>
        <RewardCard isRaised reward={unlockedReward} />
      </DialogContent>
      <DialogActions>
        <Button color="primary" onClick={takeReward}>
          {t('take')}
        </Button>
        <Button autoFocus color="primary" onClick={toggleModal}>
          {t('keep earning')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default memo(RewardModal);
