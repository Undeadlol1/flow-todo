import React from 'react';
import { sections } from '../storybookContants';
import { UpsertDailyGoal } from './UpsertDailyGoal';

export default {
    component: UpsertDailyGoal,
    title: sections.unsorted + 'UpsertDailyGoal',
};

export const Normal = () => (
    <UpsertDailyGoal />
)
