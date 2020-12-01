import { Box } from '@material-ui/core';
import React, { memo } from 'react';
import { If } from 'react-if';
import { useSelector } from 'react-redux';
import { TasksList } from '../../components/tasks/TasksList';
import { Autocomplete } from '../../components/unsorted/Autocomplete';
import { WhatDoYouFeelSlider } from '../../components/unsorted/WhatDoYouFeelSlider';
import { Task } from '../../entities/Task';
import { useTypedTranslate } from '../../services';
import {
  focusModeTasksSelector,
  tasksSelector,
} from '../../store/selectors';

export interface FocusModePageProps {
  isLoading: boolean;
  tasksToList: Task[];
  tasksForAutoComplete: Task[];
}

export const FocusModePage = memo(function FocusModePage({
  isLoading = false,
  tasksToList = [],
  tasksForAutoComplete = [],
}: FocusModePageProps) {
  const t = useTypedTranslate();
  const autocompleteOptions = tasksForAutoComplete.map((task) => ({
    value: task,
    label: task.name,
  }));

  return (
    <Box>
      <Autocomplete
        options={autocompleteOptions}
        label={t('pick_or_create_a_task')}
        onChange={(payload) => {
          console.log('payload: ', payload);
        }}
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

export function FocusModePageContainer() {
  const activeTasks = useSelector(tasksSelector);
  const focusModeTasks = useSelector(focusModeTasksSelector);

  return (
    <FocusModePage
      isLoading={false}
      tasksToList={focusModeTasks || []}
      tasksForAutoComplete={activeTasks || []}
    />
  );
}
