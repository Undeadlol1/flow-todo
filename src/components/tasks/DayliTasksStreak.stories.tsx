import React from 'react';
import { streaks } from '../dataMocks';
import { sections } from '../storybookContants';
import DayliTasksStreak from './DayliTasksStreak';

export default {
  component: DayliTasksStreak,
  title: `${sections.tasks}DayliTasksStreak`,
};

export const Demos = () => (
  <>
    Done yesterday:
    {' '}
    <br />
    (meaning user is working on a streak, it is not yet broken)
    <DayliTasksStreak streak={streaks.doneTasksYesterday} />
    Done today:
    <DayliTasksStreak streak={streaks.doneTasksToday} />
    Few days:
    <DayliTasksStreak streak={streaks.doneTasksFewDays} />
    Noting will be shown if streak is broken:
    <DayliTasksStreak streak={streaks.streakIsBroken} />
  </>
  );
