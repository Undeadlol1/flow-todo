import DailyStreak from './dailyStreak';
import addDays from 'date-fns/addDays';
import subDays from 'date-fns/esm/subDays';
import isSameDay from 'date-fns/esm/isSameDay';
import { IDayliStreak } from '../entities/IDayliStreak';
import TaskService from './TaskService';
import { getUniqueId } from '../helpers/getUniqueId';
import { Task } from '../entities/Task';

const today = Date.now();
const tommorow = addDays(today, 1).getTime();
const yesterday = subDays(today, 1).getTime();
const twoDaysAgo = subDays(today, 2).getTime();
const threeDaysAgo = subDays(today, 3).getTime();

const typicalTask: Task = {
  dueAt: today,
  isDone: false,
  createdAt: today,
  id: getUniqueId(),
  name: 'task name',
  userId: getUniqueId()
};

describe('TaskService.isStale returns"', () => {
  it('true if task hasnt been worked on.', () => {
    const result = TaskService.isStale(typicalTask);
    expect(result).toEqual(false);
  });
});
