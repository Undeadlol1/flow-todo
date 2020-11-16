import { Box } from '@material-ui/core';
import React, { memo } from 'react';
import { TasksList } from '../../components/tasks/TasksList';
import { WhatDoYouFeelSlider } from '../../components/unsorted/WhatDoYouFeelSlider';
import { Task } from '../../entities/Task';
import { If } from 'react-if';

export interface FocusModePageProps {
  tasks: Task[];
  isLoading: boolean;
}

const FocusModePage = memo(function FocusModePage({
  tasks,
  isLoading,
}: FocusModePageProps) {
  return (
    <Box>
      <Box mb={2}>
        <TasksList tasks={tasks} loading={isLoading} />
      </Box>
      <If condition={!isLoading}>
        <WhatDoYouFeelSlider onChange={console.log} />
      </If>
    </Box>
  );
});

FocusModePage.displayName = 'FocusModePage';

export { FocusModePage };
