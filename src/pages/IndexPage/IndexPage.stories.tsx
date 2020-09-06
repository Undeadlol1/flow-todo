import React from 'react';
import { IndexPage } from './IndexPage';
import { streaks } from '../../components/dataMocks';
import { sections } from '../../components/storybookContants';

export default {
  component: IndexPage,
  title: sections.unsorted + 'IndexPage',
};

export const ForUnauthorizedUser = () => (
  <IndexPage
    logs={[]}
    tasksToday={0}
    tasksPerDay={3}
    streak={streaks.streakIsBroken}
    createdAtleastOneTask={false}
  />
);

export const Loading = () => (
  <IndexPage
    isLoading
    logs={[]}
    tasksToday={0}
    tasksPerDay={3}
    streak={streaks.streakIsBroken}
    createdAtleastOneTask={true}
  />
);

export const userNeverCreatedAnyTasks = () => (
  <IndexPage
    logs={[]}
    tasksToday={0}
    tasksPerDay={3}
    isLoading={false}
    streak={streaks.streakIsBroken}
    createdAtleastOneTask={false}
  />
);
