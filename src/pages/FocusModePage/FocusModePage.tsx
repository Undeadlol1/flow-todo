import { Box } from '@material-ui/core';
import React, { memo } from 'react';
import { TasksList } from '../../components/tasks/TasksList';
import { WhatDoYouFeelSlider } from '../../components/unsorted/WhatDoYouFeelSlider';
import { Task } from '../../entities/Task';
import { If } from 'react-if';
import { Autocomplete } from '../../components/unsorted/Autocomplete';

export interface FocusModePageProps {
  isLoading: boolean;
  tasksToList: Task[];
  tasksForAutoComplete: Task[];
}

const FocusModePage = memo(function FocusModePage({
  isLoading = false,
  tasksToList = [],
  tasksForAutoComplete = [],
}: FocusModePageProps) {
  const autocompleteOptions = tasksForAutoComplete.map((task) => ({
    value: task,
    label: task.name,
  }));

  return (
    <Box>
      <Autocomplete
        options={autocompleteOptions}
        // TODO i18n
        label="Pick or create a task"
        onChange={console.log}
      />
      <Box mb={2}>
        <TasksList tasks={tasksToList} loading={isLoading} />
      </Box>
      <If condition={!isLoading}>
        <WhatDoYouFeelSlider onChange={console.log} />
      </If>
    </Box>
  );
});

FocusModePage.displayName = 'FocusModePage';

export { FocusModePage };