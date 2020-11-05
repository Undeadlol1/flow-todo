import firebase from 'firebase';
import { getFirestore, handleErrors } from '../services/index';
import { log } from '../store/index';

export function addPointsToUser(
  userId: string,
  points: number,
): Promise<void> {
  log('addPoints.userId', userId);
  log('addPoints.points', points);
  return getFirestore()
    .doc('profiles/' + userId)
    .set(
      {
        userId,
        points: firebase.firestore.FieldValue.increment(points),
        experience: firebase.firestore.FieldValue.increment(points),
      },
      { merge: true },
    )
    .catch(handleErrors);
}
