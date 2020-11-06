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
    <br />
    (meaning user is working on a streak, it is not yet broken)
    <DayliTasksStreak streak={streaks.doneTasksYesterday} />
    <hr />
    Done today:
    <hr />
    <DayliTasksStreak streak={streaks.doneTasksToday} />
    <hr />
    Few days:
    <hr />
    <DayliTasksStreak streak={streaks.doneTasksFewDays} />
    <hr />
    Noting will be shown if streak is broken:
    <hr />
    <DayliTasksStreak streak={streaks.streakIsBroken} />
  </>
);
