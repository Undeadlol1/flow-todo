import subDays from 'date-fns/esm/subDays';
import { Task } from '../entities/Task';
import { getUniqueId } from '../helpers/getUniqueId';
import TaskService from './TaskService';

const today = Date.now();
const fiveDaysAgo = subDays(today, 5).getTime();

const typicalTask: Task = {
  dueAt: today,
  isDone: false,
  createdAt: today,
  id: getUniqueId(),
  name: 'task name',
  userId: getUniqueId(),
};

describe('TaskService.isStale returns"', () => {
  it('true if "createdAt" is undefined.', () => {
    const task = {
      ...typicalTask,
      createdAt: (undefined as unknown) as number,
    };

    expect(TaskService.isStale(task)).toEqual(true);
  });

  it("true if task wasn't worked on after creation.", () => {
    const task = {
      ...typicalTask,
      history: [],
      createdAt: fiveDaysAgo,
    };
    expect(TaskService.isStale(task)).toEqual(true);
  });

  it("task wasn't worked on after update.", () => {
    const task: Task = {
      ...typicalTask,
      dueAt: fiveDaysAgo,
    };
    expect(TaskService.isStale(task)).toEqual(true);
  });
});
