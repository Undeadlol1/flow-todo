import React from 'react';
import { random } from 'faker';
import { BrowserRouter as Router } from 'react-router-dom';
import { TasksList } from './TasksList';

export default {
  component: TasksList,
  title: 'TasksList',
  decorators: [(storyFn) => <Router>{storyFn()}</Router>],
};

export const empty = () => <TasksList />;

export const loading = () => <TasksList loading />;

const props = {
  deleteTask() {
    console.log('"deleteTask" clicked');
  },
  tasks: {
    empty: false,
    docs: Array(10).fill({
      id: random.uuid(),
      data: () => ({
        name: random.word(),
      }),
    }),
  },
};

export const withItems = () => (<TasksList {...props} />);
