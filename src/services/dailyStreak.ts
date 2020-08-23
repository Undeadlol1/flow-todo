import { IDayliStreak } from '../store/index';
import differenceInDays from 'date-fns/esm/differenceInDays';
import isSameDay from 'date-fns/esm/isSameDay';
import debug from 'debug'
const log = debug('DailyStreakService')

export default class DailyStreak {
  static getEmptyStreak(): IDayliStreak {
    const today = new Date().getTime()
    return { startsAt: today, perDay: 3, updatedAt: today } as IDayliStreak
  }

  static shouldUpdate({
    tasksDoneToday,
    streak,
  }: {
    tasksDoneToday: number;
    streak: IDayliStreak;
  }): boolean {
    log('.shouldUpdate is called.')
    if (!streak.updatedAt) {
      return true
    }

    const isUpdatedToday = isSameDay(streak.updatedAt, Date.now())
    log('isUpdatedToday: ', isUpdatedToday);

    return tasksDoneToday >= streak.perDay && !isUpdatedToday;
  }

  // TODO what does this name mean? What exactly is this function do?
  static hasEnded(streak: IDayliStreak): boolean {
    log('.hasEnded is called.')
    if (!streak.updatedAt || !streak.startsAt) {
      return true
    }

    return differenceInDays(Date.now(), streak.updatedAt) > 0
  }

  static daysInARow(streak: IDayliStreak): number {
    if (!streak.updatedAt || !streak.startsAt) {
      return 0
    }
    return differenceInDays(streak.updatedAt, streak.startsAt) + 1;
  }

  static daysSinceUpdate(streak: IDayliStreak): number {
    // TODO: same checks in evry function
    if (!streak.updatedAt || !streak.startsAt) {
      return 0
    }
    return differenceInDays(Date.now(), streak.updatedAt);
  }
}
