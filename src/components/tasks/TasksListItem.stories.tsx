import React from 'react';
import { sections } from '../storybookContants';
import { TasksListItem } from './TasksListItem';
import { tasksMock } from '../dataMocks';
import List from '@material-ui/core/List';

export default {
  component: TasksListItem,
  title: sections.tasks + 'TasksListItem',
};

const props = {
  task: tasksMock[0],
};

export const Demo = (args) => {
  return (
    <List>
      <hr />
      Normal:
      <hr />
      <TasksListItem {...args} />
      <hr />
      Stale:
      <hr />
      <TasksListItem {...args} isStale />
    </List>
  );
};
Demo.args = props;
