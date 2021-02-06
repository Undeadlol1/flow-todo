import React from 'react';
import { streaks } from '../dataMocks';
import { sections } from '../storybookContants';
import DayliTasksStreak from './DayliTasksStreak';

export default {
  component: DayliTasksStreak,
  title: `${sections.tasks}DayliTasksStreak`,
};

const Header = ({ title }: { title: string }) => {
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
    <Header title="Done yesterday (meaning user is working on a streak, it is not yet broken):" />
    <DayliTasksStreak streak={streaks.doneTasksYesterday} />
    <Header title="Done today:" />
    <DayliTasksStreak streak={streaks.doneTasksToday} />
    <Header title="Few days:" />
    <DayliTasksStreak streak={streaks.doneTasksFewDays} />
    <Header title="Nothing will be shown if streak is broken:" />
    <DayliTasksStreak streak={streaks.streakIsBroken} />
  </>
);
