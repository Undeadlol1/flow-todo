import React from 'react';
import { sections } from '../storybookContants';
import { UpsertDailyGoal } from './UpsertDailyGoal';

export default {
  component: UpsertDailyGoal,
  title: `${sections.streaks}UpsertDailyGoal`,
};

export const Normal = () => <UpsertDailyGoal />;
