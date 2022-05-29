import { Task } from '../../entities/Task';
import TaskService from '../../services/TaskService';

export default class RewardedPointsCalculator {
  calculate({
    task,
    isDailyGoalReached,
    minimumAmountOfPoints = 10,
  }: {
    minimumAmountOfPoints: number;
    isDailyGoalReached: boolean;
    task: Task;
  }): number {
    let points = minimumAmountOfPoints;

    if (TaskService.isStale(task)) {
      points = points + 50;
    }

    if (isDailyGoalReached) {
      points = points + 100;
    }

    return points;
  }
}
