import { IDayliStreak } from '../store/index';
import differenceInDays from 'date-fns/esm/differenceInDays';
import isSameDay from 'date-fns/esm/isSameDay';
import debug from 'debug'
const log = debug('DailyStreakService')

export default class DailyStreak {

  static today = Date.now()

  static getEmptyStreak(): IDayliStreak {
    return { startsAt: null, updatedAt: null, perDay: 3, } as IDayliStreak
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
    const isUpdatedToday = isSameDay(streak?.updatedAt || 0, this.today)

    log('.shouldUpdate is called.')
    log('isTaskGoalReached: ', isTaskGoalReached);
    log('isUpdatedToday: ', isUpdatedToday);

    if (!isTaskGoalReached) return false
    else return isTaskGoalReached && !isUpdatedToday;
  }

  // TODO rename or add comments.
  // TODO what does this name mean? What exactly is this function do?
  static hasEnded(streak: IDayliStreak): boolean {
    log('.hasEnded is called. %O', streak)
    if (!streak.updatedAt || !streak.startsAt) {
      return true
    }

    return differenceInDays(this.today, streak.updatedAt) > 0
  }

  static daysInARow({ startsAt, updatedAt }: IDayliStreak): number {
    if (!updatedAt || !startsAt) return 0
    return differenceInDays(updatedAt, startsAt) + 1;
  }

  static daysSinceUpdate(streak: IDayliStreak): number {
    return differenceInDays(this.today, streak.updatedAt || this.today);
  }

}
