export default class LevelingService {
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
    return (
      pointsCalcuated - this.calculatePointsToNextLevel(level - 1)
    );
  }

  static calculatePointsToNextLevel(level: number) {
    const baseXP = 30
    const exponent = 1.1;
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
}