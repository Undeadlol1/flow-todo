import React from 'react';
import nanoid from 'nanoid';
import { sections } from '../storybookContants';
import { DayliGoalsList } from './DayliGoalsList';
import DailyStreak from '../../services/dailyStreak';
import { streaks } from '../dataMocks';
import { DailyGoal } from '../../store/types';

export default {
  component: DayliGoalsList,
  title: `${sections.streaks}DayliGoalsList`,
};

const goals = [
  {
    id: nanoid(),
    name: 'Eat healthy',
    streak: DailyStreak.getEmptyStreak(),
  },
  {
    id: nanoid(),
    name: 'Develop app',
    streak: streaks.doneTasksToday,
  },
  {
    id: nanoid(),
    name: 'Sports',
    streak: streaks.doneTasksFewDays,
  },
] as DailyGoal[];

export const Demo = args => <DayliGoalsList {...args} />;
Demo.args = { goals };
