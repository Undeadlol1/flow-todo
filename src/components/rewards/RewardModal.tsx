import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import clsx from 'clsx';
import React, { memo } from 'react';
import { useDispatch } from 'react-redux';
import { useTypedSelector } from '../../store';
import { Reward } from '../../store/rewardsSlice';
import { toggleRewardModal } from '../../store/uiSlice';
import RewardCard from './RewardCard';
import get from 'lodash/get';
import findLast from 'ramda/es/findLast';
import { handleErrors } from '../../services/index';
import { useFirestore, UserProfile } from 'react-redux-firebase';

interface Props {
  isOpen: boolean;
  className?: string;
}

const RewardModal: React.FC<Props> = props => {
  const dispatch = useDispatch();
  const firestore = useFirestore();
  const { profile } = useTypedSelector(s => s.firestore.data);
  const userPoints = get(profile, 'points', 0);
  const rewards = useTypedSelector(
    s => s.firestore.ordered.rewards as Reward[],
  );
  const nextReward = findLast(
    i => i.points <= userPoints,
    rewards || [],
  );
  function handleClose() {
    dispatch(toggleRewardModal());
  }

  async function claimReward() {
    try {
      await Promise.all([
        firestore.doc('rewards/' + nextReward!.id).delete(),
        firestore
          .doc('profile/' + profile!.id)
          .update({ coins: profile.coins - nextReward!.points }),
      ]);
    } catch (e) {
      handleErrors(e);
    } finally {
      dispatch(toggleRewardModal());
    }
  }
  return (
    <Dialog
      open={props.isOpen}
      // onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      // aria-describedby="alert-dialog-description"
      className={clsx(props.className)}
    >
      <DialogTitle id="alert-dialog-title">
        Вы открыли награду!
      </DialogTitle>
      <DialogContent>
        <RewardCard reward={nextReward} />
        {/* <DialogContentText id="alert-dialog-description">
            Let Google help apps determine location. This means
            sending anonymous location data to Google, even when no
            apps are running.
          </DialogContentText> */}
      </DialogContent>
      <DialogActions>
        <Button onClick={claimReward} color="primary">
          Забрать
        </Button>
        <Button onClick={handleClose} color="primary" autoFocus>
          Продолжить копить
        </Button>
      </DialogActions>
    </Dialog>
  );
};
export default memo(RewardModal);
