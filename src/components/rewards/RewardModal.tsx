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
import { useFirestore } from 'react-redux-firebase';
import {
  handleErrors,
  useTypedTranslate,
} from '../../services/index';
import { Profile, useTypedSelector } from '../../store';
import { Reward } from '../../store/rewardsSlice';
import { toggleRewardModal } from '../../store/uiSlice';
import RewardCard from './RewardCard';

interface Props {
  isOpen: boolean;
  className?: string;
}

const RewardModal: React.FC<Props> = props => {
  const dispatch = useDispatch();
  const t = useTypedTranslate();
  const firestore = useFirestore();
  const { profile }: { profile: Profile } = useTypedSelector(
    s => s.firestore.data,
  );
  const userPoints = get(profile, 'points', 0);
  const rewards = useTypedSelector(
    s => s.firestore.ordered.rewards as Reward[],
  );
  const nextReward = findLast(
    i => i.points <= userPoints,
    rewards || [],
  );

  function toggleModal() {
    dispatch(toggleRewardModal());
  }
  async function claimReward() {
    try {
      toggleModal();
      await Promise.all([
        await firestore
          .doc('profiles/' + profile.userId)
          .update({ points: profile.points - nextReward!.points }),
        await firestore.delete({
          collection: 'rewards',
          doc: nextReward!.id,
        }),
      ]);
    } catch (e) {
      handleErrors(e);
    }
  }

  return (
    <Dialog
      open={props.isOpen}
      onClose={toggleModal}
      aria-labelledby="alert-dialog-title"
      className={clsx(props.className)}
      aria-describedby="alert-dialog-title"
    >
      <DialogTitle id="alert-dialog-title">
        {t('you unlocked a reward')}!
      </DialogTitle>
      <DialogContent>
        <RewardCard reward={nextReward} />
      </DialogContent>
      <DialogActions>
        <Button onClick={claimReward} color="primary">
          {t('take')}
        </Button>
        <Button onClick={toggleModal} color="primary" autoFocus>
          {t('keep earning')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default memo(RewardModal);
