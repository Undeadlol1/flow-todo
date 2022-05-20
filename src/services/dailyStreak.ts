import differenceInDays from 'date-fns/esm/differenceInDays';
import isSameDay from 'date-fns/esm/isSameDay';
import debug from 'debug';
import format from 'date-fns/esm/format';
import { DailyStreak as IDailyStreak } from '../entities/DailyStreak';

const log = debug('DailyStreakService');

export default class DailyStreak {
  constructor(private streak: IDailyStreak) { }
  static today = Date.now();

  getUpdatedStreak({
    tasksDoneToday,
  }: {
    tasksDoneToday: number;
  }): IDailyStreak {
    const currentStreak = this.streak;
    const isStreakBroken = this.isBroken();
    const shouldStreakUpdate = this.shouldUpdate({
      tasksDoneToday,
    });
    const updatedStreak = {
      ...currentStreak,
      updatedAt: DailyStreak.today,
      startsAt: isStreakBroken ? DailyStreak.today : currentStreak.startsAt,
    };

    log('Returning updated streak: ', shouldStreakUpdate);
    return shouldStreakUpdate ? updatedStreak : currentStreak;
  }
  /**
   * Streak should only update if goal is reached
   * and streak was not updated today.
   */
  shouldUpdate({
    tasksDoneToday = 0,
  }: {
    tasksDoneToday: number;
  }): boolean {
    const isTaskGoalReached = tasksDoneToday >= this.streak.perDay;
    const isUpdatedToday = isSameDay(
      this.streak?.updatedAt || 0,
      DailyStreak.today,
    );

    log('isTaskGoalReached: ', isTaskGoalReached);
    log('isUpdatedToday: ', isUpdatedToday);

    if (!isTaskGoalReached) return false;
    else return isTaskGoalReached && !isUpdatedToday;
  }

  isBroken(): boolean {
    try {
      const difference = differenceInDays(
        DailyStreak.today,
        this.streak.updatedAt as number,
      );
      log(`Streak updated ${difference} days ago.`);

      if (difference === 1) return false;
      return difference > 1;
    } catch (error) {
      log(`Error occured. Returning.`);
      return true;
    }
  }

  getDaysInARow(): number {
    const { startsAt, updatedAt } = this.streak
    if (!updatedAt || !startsAt) return 0;
    return differenceInDays(updatedAt, startsAt) + 1;
  }

  daysSinceUpdate(): number | undefined {
    if (!this.streak.updatedAt) return undefined;
    return differenceInDays(DailyStreak.today, this.streak.updatedAt);
  }

  static getEmptyStreak(): IDailyStreak {
    return {
      startsAt: null,
      updatedAt: null,
      perDay: 3,
    } as IDailyStreak;
  }

  static log(streak: IDailyStreak) {
    const pattern = 'dd/MM';
    log('startsAt', format(streak.startsAt || 0, pattern));
    log('updatedAt', format(streak.updatedAt || 0, pattern));
  }
}
