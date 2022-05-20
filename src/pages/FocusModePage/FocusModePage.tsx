import { Box } from '@material-ui/core';
import React, { memo } from 'react';
import { If } from 'react-if';
import useList from 'react-use/lib/useList';
import { TasksList } from '../../components/tasks/TasksList';
import { Autocomplete } from '../../components/unsorted/Autocomplete';
import { WhatDoYouFeelSlider } from '../../components/unsorted/WhatDoYouFeelSlider';
import { Task } from '../../entities/Task';
import { getUniqueId } from '../../helpers/getUniqueId';
import { useTypedTranslate } from '../../services';

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
  const t = useTypedTranslate();
  const [tasks, { push }] = useList<Task>([]);
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
          push({
            id: getUniqueId(),
            name: payload.label,
          } as Task);
        }}
      />
      <Box mb={2}>
        <TasksList
          tasks={tasks || tasksToList}
          isLoading={isLoading}
        />
      </Box>
      <If condition={!isLoading}>
        <WhatDoYouFeelSlider onChange={console.log} />
      </If>
    </Box>
  );
});

FocusModePage.displayName = 'FocusModePage';

export { FocusModePage };
