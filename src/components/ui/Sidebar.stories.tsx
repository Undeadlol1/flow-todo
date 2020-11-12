import React from 'react';
import Sidebar from './Sidebar';
import { sections } from '../storybookContants';

export default {
  component: Sidebar,
  title: `${sections.ui}Sidebar`,
};

export const Normal = () => <Sidebar isOpen isLoggedIn />;
