import React, { useState, useEffect } from 'react';
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
  dailyStreak: streaks.streakIsBorken,
} as TasksDoneTodayProps;

export const Demos = () => {
  const [amount, setAmount] = useState(0);
  // Change amount completed tasks every few seconds.
  useEffect(() => {
    const interval = setInterval(
      () => setAmount(i => (i < props.tasksPerDay ? ++i : 0)),
      2000,
    );
    return () => clearInterval(interval);
  });

  return (
    <>
      With data:
      <TasksDoneToday {...props} />
      Is loading:
      <TasksDoneToday {...props} isLoaded={false} />
      Change animation:
      <TasksDoneToday {...props} tasksToday={amount} />
    </>
  );
};
