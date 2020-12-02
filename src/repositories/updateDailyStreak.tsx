import { Profile } from '../entities/Profile';
import { upsertProfile } from './upsertProfile';
import DailyStreak from '../services/dailyStreak';

export async function updateDailyStreak({
  profile,
  userId,
  tasksDoneToday,
}: {
  userId: string;
  profile: Profile;
  tasksDoneToday: number;
}) {
  return upsertProfile({
    ...profile,
    userId,
    dailyStreak: DailyStreak.getUpdatedStreak({
      tasksDoneToday,
      streak: profile.dailyStreak,
    }),
  });
}
