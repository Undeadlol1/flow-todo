import React from 'react';
import { getUniqueId } from '../../helpers/getUniqueId';
import DailyStreak from '../../services/dailyStreak';
import { DailyGoal } from '../../store/types';
import { streaks } from '../dataMocks';
import { sections } from '../storybookContants';
import { DayliGoalsList } from './DayliGoalsList';

export default {
  component: DayliGoalsList,
  title: `${sections.streaks}DayliGoalsList`,
};

const goals = [
  {
    id: getUniqueId(),
    name: 'Eat healthy',
    streak: DailyStreak.getEmptyStreak(),
  },
  {
    id: getUniqueId(),
    name: 'Develop app',
    streak: streaks.doneTasksToday,
  },
  {
    id: getUniqueId(),
    name: 'Sports',
    streak: streaks.doneTasksFewDays,
  },
] as DailyGoal[];

export const Demo = (args) => <DayliGoalsList {...args} />;
Demo.args = { goals };
