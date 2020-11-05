import { getFirestore } from '../services/index';
import DailyStreak from '../services/dailyStreak';
import { Profile } from '../entities/Profile';

export async function upsertProfile(profile: Profile) {
  if (!profile.userId) throw Error('You must specify userId!');
  if (!profile.dailyStreak)
    profile.dailyStreak = DailyStreak.getEmptyStreak();
  return getFirestore()
    .doc('profiles/' + profile.userId)
    .set(profile, { merge: true });
}
