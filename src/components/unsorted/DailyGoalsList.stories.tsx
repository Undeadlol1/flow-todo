import React from 'react';
import { getUniqueId } from '../../helpers/getUniqueId';
import DailyStreak from '../../services/dailyStreak';
import { DailyGoal } from '../../store/types';
import { streaks } from '../dataMocks';
import { sections } from '../storybookContants';
import { DailyGoalsList } from './DailyGoalsList';

export default {
  component: DailyGoalsList,
  title: `${sections.streaks}DailyGoalsList`,
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

export const Demo = (args) => <DailyGoalsList {...args} />;
Demo.args = { goals };
