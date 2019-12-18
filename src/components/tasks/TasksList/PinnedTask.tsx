import { CardContent, CardHeader } from '@material-ui/core';
import Card from '@material-ui/core/Card';
import React, { memo } from 'react';
import { useSelector } from 'react-redux';
import { pinnedTaskSelector } from '../../../store/selectors';
import CreateSubtask from '../CreateSubtask/CreateSubtask';
import SubtasksList from '../SubtasksList';

let taskId = '';

export default memo(function PinnedTask() {
  const task = useSelector(pinnedTaskSelector);
  if (!task) return null;
  if (task && task.id) taskId = task.id;
  return (
    <Card>
      <CardHeader title={task.name} />
      <CardContent>
        <CreateSubtask taskId={taskId} />
        <SubtasksList documents={task.subtasks} />
      </CardContent>
    </Card>
  );
});
