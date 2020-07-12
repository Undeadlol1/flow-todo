import { DayliStreak } from '../store/index';
import differenceInDays from 'date-fns/esm/differenceInDays';

export default class DailyStreak {
  static shouldUpdate({
    tasksDoneToday,
    streak,
  }: {
    tasksDoneToday: number;
    streak: DayliStreak;
  }): boolean {
    if (!streak.updatedAt) {
      return true
    }

    const now = Date.now();
    const isUpdatedToday =
      differenceInDays(streak.updatedAt, now) === 0;

    console.log('tasksDoneToday: ', tasksDoneToday);
    console.log('streak.perDay: ', streak.perDay);
    return tasksDoneToday >= streak.perDay && !isUpdatedToday;
  }

  static isBroken(streak: DayliStreak): boolean {
    if (!streak.updatedAt) {
      return true
    }

    const now = Date.now();
    return (
      !streak.startsAt || differenceInDays(streak.updatedAt, now) >= 1
    );
  }

  static daysInARow(streak: DayliStreak): number {
    if (!streak.updatedAt || !streak.startsAt) {
      return 0
    }
    return differenceInDays(streak.updatedAt, streak.startsAt);
  }
}
