import React, { useState, useEffect } from 'react';
import TasksDoneToday from './TasksDoneToday';
import { sections } from '../storybookContants';
import { TasksDoneTodayProps } from './TasksDoneToday';
import { streaks, TasksDoneTodaySampleProps } from '../dataMocks';

export default {
  component: TasksDoneToday,
  title: sections.users + 'TasksDoneToday',
};

const props = TasksDoneTodaySampleProps;

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
      Change animation:
      <TasksDoneToday {...props} tasksToday={amount} />
      Is achieved:
      <TasksDoneToday {...props} />
      Is loading:
      <TasksDoneToday {...props} isLoaded={false} />
    </>
  );
};
