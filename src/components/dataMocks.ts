import subDays from 'date-fns/esm/subDays';
import { IDayliStreak } from '../entities/IDayliStreak';
import { TasksDoneTodayProps } from './tasks/TasksDoneToday';

const perDay = 3;
const today = new Date().getTime();
const yesterday = subDays(today, 1).getTime();

export const streaks = {
  doneTasksYesterday: {
    perDay,
    startsAt: yesterday,
    updatedAt: yesterday,
  } as IDayliStreak,
  doneTasksToday: {
    perDay,
    startsAt: today,
    updatedAt: today,
  } as IDayliStreak,
  doneTasksFewDays: {
    perDay,
    startsAt: subDays(today, 4).getTime(),
    updatedAt: today,
  } as IDayliStreak,
  streakIsBroken: {
    perDay,
    startsAt: subDays(today, 5).getTime(),
    updatedAt: subDays(today, 3).getTime(),
  } as IDayliStreak,
};
/**
 * NOTE: placed here because if this is placed
 * inside a story, the story book we break
 * because all exports are stories.
 */
export const TasksDoneTodaySampleProps = {
  tasksToday: 3,
  tasksPerDay: 3,
  isLoaded: true,
  dailyStreak: streaks.streakIsBroken,
} as TasksDoneTodayProps;
