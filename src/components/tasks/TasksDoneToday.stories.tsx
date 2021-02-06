import React, { useEffect, useState } from 'react';
import { TasksDoneTodaySampleProps } from '../dataMocks';
import { sections } from '../storybookContants';
import TasksDoneToday from './TasksDoneToday';

export default {
  component: TasksDoneToday,
  title: `${sections.tasks}TasksDoneToday`,
};

export const Demos = (args) => {
  const [amount, setAmount] = useState(0);
  // Change amount completed tasks every few seconds.
  useEffect(() => {
    const interval = setInterval(
      () => setAmount((i) => (i < args.tasksPerDay ? i + 1 : 0)),
      2000,
    );
    return () => clearInterval(interval);
  });

  return (
    <>
      Change animation:
      <TasksDoneToday {...args} tasksToday={amount} />
      Is achieved:
      <TasksDoneToday {...args} />
      Is loading:
      <TasksDoneToday {...args} isLoaded={false} />
      If done more than necessary:
      <TasksDoneToday {...args} tasksToday={5} />
    </>
  );
};

Demos.args = TasksDoneTodaySampleProps;
