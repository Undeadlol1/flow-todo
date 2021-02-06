import React from 'react';
import { streaks } from '../dataMocks';
import { sections } from '../storybookContants';
import CommentForDevelopers from './DayliTasksStreak';

export default {
  component: CommentForDevelopers,
  title: `${sections.tasks}DayliTasksStreak`,
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
    <CommentForDevelopers streak={streaks.doneTasksYesterday} />
    <HeaderWithComment value="Streak was done today:" />
    <CommentForDevelopers streak={streaks.doneTasksToday} />
    <HeaderWithComment value="Streak is done few days in a row:" />
    <CommentForDevelopers streak={streaks.doneTasksFewDays} />
    <HeaderWithComment value="Streak is broken:" />
    <CommentForDevelopers streak={streaks.streakIsBroken} />
  </>
);
