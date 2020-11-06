import React from 'react';
import { sections } from '../storybookContants';
import { TasksListItem } from './TasksListItem';

export default {
    component: TasksListItem,
    title: sections.unsorted + 'TasksListItem',
};

const props = {}

export const Demo = args => <TasksListItem {...args} />
Demo.args = props
