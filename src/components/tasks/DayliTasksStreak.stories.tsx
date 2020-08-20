import React from 'react';
import DayliTasksStreak from './DayliTasksStreak';
import { IDayliStreak } from '../../store/index';
import addDays from 'date-fns/addDays';
import subDays from 'date-fns/subDays';

export default {
  component: DayliTasksStreak,
  title: 'DayliTasksStreak',
};

const today = new Date();
// const tomorrow = addDays(today, 1)
const yesterday = subDays(today, 1);

export const doneToday = () => {
  const streak = {
    startsAt: today,
    updatedAt: today,
  } as IDayliStreak;

  return <DayliTasksStreak streak={streak} />;
};

export const doneFewDays = () => {
  const streak = {
    startsAt: today,
    updatedAt: addDays(new Date(), 3),
  } as IDayliStreak;

  return <DayliTasksStreak streak={streak} />;
};

export const streakBroken = () => {
  const threeDaysAgo = subDays(today, 3);
  const streak = {
    startsAt: threeDaysAgo,
    updatedAt: yesterday,
  } as IDayliStreak;

  return <DayliTasksStreak streak={streak} />;
};

export const initial = () => {
  const streakSample = {
    startsAt: undefined,
    updatedAt: undefined,
    perDay: 3,
  } as IDayliStreak;

  return <DayliTasksStreak streak={streakSample} />;
};
