import React from 'react';
import DayliTasksStreak from './DayliTasksStreak';
import { IDayliStreak } from '../../store/index';
import addDays from 'date-fns/addDays';
import { sections } from '../storybookContants';
import { streaks } from '../dataMocks';

export default {
  component: DayliTasksStreak,
  title: sections.tasks + 'DayliTasksStreak',
};

const today = new Date();

export const doneToday = () => {
  return <DayliTasksStreak streak={streaks.doneTasksToday} />;
};

export const doneFewDays = () => {
  const streak = {
    startsAt: today,
    updatedAt: addDays(new Date(), 3),
  } as IDayliStreak;

  return <DayliTasksStreak streak={streak} />;
};

export const streakBroken = () => {
  return <DayliTasksStreak streak={streaks.streakIsBorken} />;
};

export const initial = () => {
  const streakSample = {
    startsAt: undefined,
    updatedAt: undefined,
    perDay: 3,
  } as IDayliStreak;

  return <DayliTasksStreak streak={streakSample} />;
};
