import { DayliStreak } from '../store/index';
import differenceInDays from 'date-fns/esm/differenceInDays';
// TODO this whole service file needs to be refactored.
export default class UserService {
  static shouldDailyStreakUpdate({
    tasksDoneToday,
    streak,
  }: {
    tasksDoneToday: number;
    streak: DayliStreak;
  }): boolean {
    const now = Date.now();
    const isUpdatedToday =
      differenceInDays(streak.updatedAt, now) === 0;

    console.log('tasksDoneToday: ', tasksDoneToday);
    console.log('streak.perDay: ', streak.perDay);
    return tasksDoneToday >= streak.perDay && !isUpdatedToday;
  }

  static isStreakBroken(streak: DayliStreak): boolean {
    const now = Date.now();
    return (
      !streak.startsAt || differenceInDays(streak.updatedAt, now) >= 1
    );
  }
}
