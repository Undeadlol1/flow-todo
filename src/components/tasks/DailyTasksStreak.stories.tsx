import React from 'react';
import { streaks } from '../dataMocks';
import { sections } from '../storybookContants';
import DailyTasksStreak from './DailyTasksStreak';

export default {
  component: DailyTasksStreak,
  title: `${sections.tasks}DailyTasksStreak`,
};

const HeaderWithComment = ({ value: title }: { value: string }) => {
  return (
    <div
      style={{ backgroundColor: 'lightblue', fontStyle: 'italic' }}
    >
      <hr />
      {title}
      <hr />
    </div>
  );
};

export const Demos = () => (
  <>
    <HeaderWithComment value="Demo when task was done yesterday (meaning user is still working on a streak, it is not yet broken):" />
    <DailyTasksStreak streak={streaks.doneTasksYesterday} />
    <HeaderWithComment value="Streak was done today:" />
    <DailyTasksStreak streak={streaks.doneTasksToday} />
    <HeaderWithComment value="Streak is done few days in a row:" />
    <DailyTasksStreak streak={streaks.doneTasksFewDays} />
    <HeaderWithComment value="Streak is broken:" />
    <DailyTasksStreak streak={streaks.streakIsBroken} />
  </>
);
