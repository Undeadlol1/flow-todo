import { DayliStreak } from '../store/index';
import differenceInDays from 'date-fns/esm/differenceInDays';
// TODO this whole service file needs to be refactored.
export default class UserService {
    /**
     * Get user level by points.
     * @param userPoints
     */
    static calculateUserLevel(userPoints: number): number {
        let pointsCalcuated = 0;
        let functionCalledCount = 0;
        while (pointsCalcuated <= userPoints) {
            pointsCalcuated += this.calculatePointsToNextLevel(
                functionCalledCount,
            );
            functionCalledCount++;
        }
        return functionCalledCount - 1;
    }

    static calculateTotalPointsToReachALevel(
        desiredLevel: number,
    ): number {
        let level = 0;
        let pointsCalcuated = 0;
        while (level <= desiredLevel) {
            pointsCalcuated += this.calculatePointsToNextLevel(level);
            level++;
        }
        return pointsCalcuated - this.calculatePointsToNextLevel(level - 1);
    }

    static calculatePointsToNextLevel(level: number) {
        const exponent = 1.1;
        const baseXP = level <= 3 ? 30 : 10;
        return baseXP * ((level ^ exponent) | 1);
    }

    static willUserLevelUp(
        currentPoints: number,
        pointsAboutToAdd: number,
    ): boolean {
        const currentLevel = this.calculateUserLevel(currentPoints);
        const levelAfterAddingPoints = this.calculateUserLevel(
            currentPoints + pointsAboutToAdd,
        );
        return levelAfterAddingPoints > currentLevel;
    }

    static shouldDailyStreakUpdate({
        tasksDoneToday,
        streak }: { tasksDoneToday: number, streak: DayliStreak }): boolean {
        const now = Date.now();
        const isUpdatedToday =
            differenceInDays(streak.updatedAt, now) === 0;
        const isStreakBroken =
            !streak.startsAt ||
            differenceInDays(streak.updatedAt, now) >= 1;

        return tasksDoneToday + 1 > 2 && !isUpdatedToday
    }

    static isStreakBroken(streak: DayliStreak): boolean {
        const now = Date.now();
        return !streak.startsAt ||
            differenceInDays(streak.updatedAt, now) >= 1;
    }
}