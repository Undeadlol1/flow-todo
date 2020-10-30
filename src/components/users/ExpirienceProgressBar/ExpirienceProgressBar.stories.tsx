import React from 'react';
import { sections } from '../../storybookContants';
import ExpirienceProgressBar from './ExpirienceProgressBar';
import { Profile } from '../../../store/index';

export default {
  component: ExpirienceProgressBar,
  title: `${sections.users}ExpirienceProgressBar`,
};

export const Normal = () => (
  <>
    User is unathorized:
    <ExpirienceProgressBar
      profile={undefined}
      isAnimationActive={false}
    />
    With some experience:
    <ExpirienceProgressBar
      isAnimationActive={false}
      profile={{ experience: 1000 } as Profile}
    />
    Animation:
    <ExpirienceProgressBar
      isAnimationActive
      profile={{ experience: 1000 } as Profile}
    />
  </>
  );
