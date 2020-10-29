import React from 'react';
import { sections } from '../storybookContants';
import { WhatDoYouFeelAboutTheTask } from './WhatDoYouFeelAboutTheTask';

export default {
  component: WhatDoYouFeelAboutTheTask,
  title: `${sections.tasks}WhatDoYouFeelAboutTheTask`,
};

export const Normal = () => <WhatDoYouFeelAboutTheTask />;
