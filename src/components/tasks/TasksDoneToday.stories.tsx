import React, { useEffect, useState } from 'react';
import { TasksDoneTodaySampleProps } from '../dataMocks';
import { sections } from '../storybookContants';
import TasksDoneToday from './TasksDoneToday';

export default {
  component: TasksDoneToday,
  title: `${sections.tasks}TasksDoneToday`,
};

const props = TasksDoneTodaySampleProps;

export const Demos = () => {
  const [amount, setAmount] = useState(0);
  // Change amount completed tasks every few seconds.
  useEffect(() => {
    const interval = setInterval(
      () => setAmount(i => (i < props.tasksPerDay ? i + 1 : 0)),
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
      If done more than necessary:
      <TasksDoneToday {...props} tasksToday={5} />
    </>
  );
};
