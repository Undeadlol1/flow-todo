import { random } from 'faker';
import subDays from 'date-fns/esm/subDays';
import { DailyStreak } from '../entities/DailyStreak';
import { TasksDoneTodayProps } from './tasks/TasksDoneToday';
import { Task } from '../entities/Task';

const perDay = 3;
const today = new Date().getTime();
const yesterday = subDays(today, 1).getTime();

export const tasksMock = Array(25)
  .fill('')
  .map(
    (i, index) =>
      ({
        id: random.uuid(),
        name: random.boolean() ? random.word() : random.words(10),
        subtasks: random.boolean()
          ? [
              {
                name: 'This is a name of subtask.',
              },
            ]
          : undefined,
      } as Task),
  );

export const streaks = {
  doneTasksYesterday: {
    perDay,
    startsAt: yesterday,
    updatedAt: yesterday,
  } as DailyStreak,
  doneTasksToday: {
    perDay,
    startsAt: today,
    updatedAt: today,
  } as DailyStreak,
  doneTasksFewDays: {
    perDay,
    startsAt: subDays(today, 4).getTime(),
    updatedAt: today,
  } as DailyStreak,
  streakIsBroken: {
    perDay,
    startsAt: subDays(today, 5).getTime(),
    updatedAt: subDays(today, 3).getTime(),
  } as DailyStreak,
};
/**
 * NOTE: placed here because if this is placed
 * inside a story, the story book will break
 * because all exports are stories.
 */
export const TasksDoneTodaySampleProps = {
  tasksToday: 3,
  tasksPerDay: 3,
  isLoaded: true,
  dailyStreak: streaks.streakIsBroken,
} as TasksDoneTodayProps;
