import subDays from 'date-fns/esm/subDays';
import { now } from 'lodash';
import { Task } from '../entities/Task';
import { getUniqueId } from '../helpers/getUniqueId';
import TaskService from './TaskService';

const today = Date.now();
const fiveDaysAgo = subDays(today, 5).getTime();

const taskDefaults: Task = {
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
      ...taskDefaults,
      createdAt: (undefined as unknown) as number,
    };

    expect(TaskService.isStale(task)).toEqual(true);
  });

  it("true if task wasn't worked on after creation.", () => {
    const task = {
      ...taskDefaults,
      history: [],
      createdAt: fiveDaysAgo,
    };
    expect(TaskService.isStale(task)).toEqual(true);
  });
  // TODO: remove this test? Is this one wrong?
  it("true if task wasn't worked on after update.", () => {
    const task: Task = {
      ...taskDefaults,
      dueAt: fiveDaysAgo,
    };
    expect(TaskService.isStale(task)).toEqual(true);
  });

  it('false if task is old but was updated.', () => {
    const task: Task = {
      ...taskDefaults,
      updatedAt: today,
      dueAt: fiveDaysAgo,
      createdAt: fiveDaysAgo,
    };
    expect(TaskService.isStale(task)).toEqual(false);
  });
});
