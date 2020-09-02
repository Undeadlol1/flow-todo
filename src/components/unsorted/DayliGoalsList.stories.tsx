import React from 'react';
import { sections } from '../storybookContants';
import { DayliGoalsList } from './DayliGoalsList';
import DailyStreak from '../../services/dailyStreak';

export default {
  component: DayliGoalsList,
  title: sections.unsorted + 'DayliGoalsList',
};

export const Normal = () => (
  <DayliGoalsList
    goals={[
      {
        id: '123',
        name: 'This is it',
        streak: DailyStreak.getEmptyStreak(),
      },
    ]}
  />
);
