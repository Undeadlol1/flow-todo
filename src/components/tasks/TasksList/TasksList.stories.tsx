import { random } from 'faker';
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { TasksList } from './TasksList';
import { addDecorator } from '@storybook/react';
import { sections } from '../../storybookContants';

type DecoratorFunction = Parameters<typeof addDecorator>[0];

export interface StoryMetadata {
  component: React.ReactNode;
  title: string;
  decorators?: DecoratorFunction[];
}

const metaData: StoryMetadata = {
  component: TasksList,
  title: sections.tasks + 'TasksList',
  decorators: [storyFn => <Router>{storyFn()}</Router>],
};

export default metaData;

const props = {
  loading: false,
  deleteTask() {
    console.log('"deleteTask" clicked');
  },
  tasks: Array(10)
    .fill('')
    .map(() => ({
      id: random.uuid(),
      name: random.word(),
    })),
};

export const withItems = () => <TasksList {...props} />;

export const canDelete = () => (
  <TasksList {...{ ...props, canDelete: true }} />
);

export const empty = () => <TasksList />;

export const loading = () => <TasksList loading />;
