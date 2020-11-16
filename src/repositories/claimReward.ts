import firebase from 'firebase/app';
import { Reward } from '../store/rewardsSlice';
import { deleteReward } from './deleteReward';
import { getFirestore, handleErrors } from '../services/index';

const { FieldValue } = firebase.firestore;

export async function claimReward(reward: Reward) {
  try {
    const fs = getFirestore();

    if (!reward.isReccuring) {
      deleteReward(reward.id);
    }
    return fs.doc('profiles/' + reward.userId).update({
      points: FieldValue.increment(reward.points * -1),
    });
  } catch (error) {
    handleErrors(error);
  }
}
