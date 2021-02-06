import React from 'react';
import { streaks } from '../dataMocks';
import { sections } from '../storybookContants';
import DailyTasksStreak from './DailyTasksStreak';
import { DailyTasksStreakProps } from './DailyTasksStreak';

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

export const Demos = (args) => (
  <>
    <HeaderWithComment value="Demo when task was done yesterday (meaning user is still working on a streak, it is not yet broken):" />
    <DailyTasksStreak {...args} streak={streaks.doneTasksYesterday} />
    <HeaderWithComment value="Streak was done today:" />
    <DailyTasksStreak {...args} streak={streaks.doneTasksToday} />
    <HeaderWithComment value="Streak is done few days in a row:" />
    <DailyTasksStreak {...args} streak={streaks.doneTasksFewDays} />
    <HeaderWithComment value="Streak is broken:" />
    <DailyTasksStreak {...args} streak={streaks.streakIsBroken} />
  </>
);

Demos.args = {
  streak: streaks.doneTasksYesterday,
  isUpdateAnimationDisabled: false,
} as DailyTasksStreakProps;
