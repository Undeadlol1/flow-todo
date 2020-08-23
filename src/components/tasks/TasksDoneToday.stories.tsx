import React from 'react';
import TasksDoneToday from './TasksDoneToday';
import { sections } from '../storybookContants';
import { TasksDoneTodayProps } from './TasksDoneToday';
import { streaks } from '../dataMocks';

export default {
  component: TasksDoneToday,
  title: sections.users + 'TasksDoneToday',
};

const props = {
  tasksToday: 1,
  tasksPerDay: 3,
  isLoaded: true,
  dailyStreak: streaks.doneTasksToday,
} as TasksDoneTodayProps;

export const Demos = () => {
  return (
    <>
      Some:
      <TasksDoneToday {...props} />
      Is loading:
      <TasksDoneToday {...props} isLoaded={false} />
    </>
  );
};
