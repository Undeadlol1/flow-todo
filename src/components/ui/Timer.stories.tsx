import React from 'react';
import Timer from './Timer';
import { sections } from '../storybookContants';

export default {
  component: Timer,
  title: sections.unsorted + 'Timer',
};

export const Normal = () => {
  return <Timer />;
};
