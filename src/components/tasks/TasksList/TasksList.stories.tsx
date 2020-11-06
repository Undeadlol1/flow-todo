import { addDecorator } from '@storybook/react';
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { sections } from '../../storybookContants';
import { TasksList } from './TasksList';
import { tasksMock } from '../../dataMocks';

type DecoratorFunction = Parameters<typeof addDecorator>[0];

export interface StoryMetadata {
  component: React.ReactNode;
  title: string;
  decorators?: DecoratorFunction[];
}

const metaData: StoryMetadata = {
  component: TasksList,
  title: `${sections.tasks}TasksList`,
  decorators: [(storyFn) => <Router>{storyFn()}</Router>],
};

export default metaData;

const props = {
  loading: false,
  tasks: tasksMock,
  deleteTask() {
    console.log('"deleteTask" clicked');
  },
};

export const withItems = () => <TasksList {...props} />;

export const canDelete = () => (
  <TasksList {...{ ...props, canDelete: true }} />
);

export const empty = () => <TasksList />;

export const loading = () => <TasksList loading />;
