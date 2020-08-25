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

  /**
   * Streak should only update if goal is reached
   * and streak was not updated today.
   */
  static shouldUpdate({
    tasksDoneToday = 0,
    streak,
  }: {
    tasksDoneToday: number;
    streak: IDayliStreak;
  }): boolean {
    const isTaskGoalReached = tasksDoneToday >= streak.perDay
    const isUpdatedToday = isSameDay(streak?.updatedAt || 0, Date.now())

    log('.shouldUpdate is called.')
    log('isTaskGoalReached: ', isTaskGoalReached);
    log('isUpdatedToday: ', isUpdatedToday);

    if (!isTaskGoalReached) {
      return false
    }

    return isTaskGoalReached && !isUpdatedToday;

  }

  // TODO rename or add comments.
  // TODO what does this name mean? What exactly is this function do?
  static hasEnded(streak: IDayliStreak): boolean {
    log('.hasEnded is called. %O', streak)
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
