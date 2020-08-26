import React from 'react';
import Sidebar from './Sidebar';
import { sections } from '../storybookContants';

export default {
  component: Sidebar,
  title: sections.ui + 'Sidebar',
};

export const Normal = () => {
  return <Sidebar isOpen isLoggedIn isTasksListEmpty />;
};
