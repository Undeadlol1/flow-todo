import React from 'react';
import Timer from './Timer';
import { sections } from '../storybookContants';

export default {
  component: Timer,
  title: `${sections.ui}Timer`,
};

export const Normal = () => <Timer />;
