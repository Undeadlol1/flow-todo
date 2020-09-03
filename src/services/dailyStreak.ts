import differenceInDays from 'date-fns/esm/differenceInDays';
import isSameDay from 'date-fns/esm/isSameDay';
import debug from 'debug'
import format from 'date-fns/esm/format';
import { IDayliStreak } from '../store/types';
import isYesterday from 'date-fns/esm/isYesterday';

const log = debug('DailyStreakService')

export default class DailyStreak {

  static today = Date.now()

  static getUpdatedStreak({ streak, tasksDoneToday }: {
    streak: IDayliStreak;
    tasksDoneToday: number;
  }): IDayliStreak {
    const shouldStreakUpdate = this.shouldUpdate({
      streak,
      tasksDoneToday
    });

    if (shouldStreakUpdate) {
      const isStreakBroken = this.isBroken(streak);
      this.logStreak(streak)
      const payload = {
        ...streak,
        updatedAt: this.today,
        startsAt: isStreakBroken ? this.today : streak.startsAt,
      }
      log('Returning updated streak.');
      this.logStreak(streak)
      return payload
    }
    log('Returning streak without update.')
    return streak
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

    log('isTaskGoalReached: ', isTaskGoalReached);
    log('isUpdatedToday: ', isUpdatedToday);

    if (!isTaskGoalReached) return false
    else return isTaskGoalReached && !isUpdatedToday;
  }

  static isBroken(streak: IDayliStreak): boolean {
    try {
      const difference = differenceInDays(this.today, streak.updatedAt as number)
      log(`Streak updated ${difference} days ago.`)

      if (difference === 1) return false
      return difference > 1
    } catch (error) {
      log(`Error occured. Returning.`)
      return true
    }
  }

  static daysInARow({ startsAt, updatedAt }: IDayliStreak): number {
    if (!updatedAt || !startsAt) return 0
    return differenceInDays(updatedAt, startsAt) + 1;
  }

  static daysSinceUpdate(streak: IDayliStreak): number {
    return differenceInDays(this.today, streak.updatedAt || this.today);
  }

  static getEmptyStreak(): IDayliStreak {
    return { startsAt: null, updatedAt: null, perDay: 3, } as IDayliStreak
  }

  static logStreak(streak: IDayliStreak) {
    const pattern = 'dd/MM'
    log('startsAt', format(streak.startsAt || 0, pattern))
    log('updatedAt', format(streak.updatedAt || 0, pattern))
  }

}
