import { getFirestore } from '../services/index';

export function deleteReward(rewardId: string): Promise<void> {
  const fs = getFirestore();
  return fs.doc('rewards/' + rewardId).delete();
}
