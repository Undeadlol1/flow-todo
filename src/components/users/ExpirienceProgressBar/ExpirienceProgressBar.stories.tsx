import React from 'react';
import { sections } from '../../storybookContants';
import ExpirienceProgressBar from './ExpirienceProgressBar';
import { Profile } from '../../../store/index';

export default {
  component: ExpirienceProgressBar,
  title: `${sections.users}ExpirienceProgressBar`,
};

export const ZeroExperience = () => (
  <ExpirienceProgressBar
    profile={{ experience: 0 }}
    isAnimationActive={false}
  />
);

export const WithSomeExperience = () => (
  <ExpirienceProgressBar
    isAnimationActive={false}
    profile={{ experience: 1000 } as Profile}
  />
);

export const Animation = () => (
  <ExpirienceProgressBar
    isAnimationActive
    profile={{ experience: 1000 } as Profile}
  />
);
