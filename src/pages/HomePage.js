import React from 'react';
import { CreateTaskContainer } from '../components/tasks/CreateTask/CreateTask';
import { TasksListContainer } from '../components/tasks/TasksList/TasksList';

export default function HomePage() {
  return (
    <>
      <CreateTaskContainer />
      <TasksListContainer />
    </>
  );
}
