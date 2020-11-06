import firebase from 'firebase';
import { getFirestore, handleErrors } from '../services/index';
import { Reward } from '../store/rewardsSlice';

const { FieldValue } = firebase.firestore;

export function claimReward(reward: Reward) {
  try {
    const fs = getFirestore();
    if (!reward.isReccuring) fs.doc('rewards/' + reward.id).delete();
    fs.doc('profiles/' + reward.userId).update({
      points: FieldValue.increment(reward.points * -1),
    });
  } catch (error) {
    handleErrors(error);
  }
}
