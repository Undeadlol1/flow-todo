import React from 'react';
import { sections } from '../storybookContants';
import { WhatDoYouFeelSlider } from './WhatDoYouFeelSlider';

export default {
  component: WhatDoYouFeelSlider,
  title: sections.ui + 'WhatDoYouFeelSlider',
};

const props = {};

export const Demo = (args) => <WhatDoYouFeelSlider {...args} />;
Demo.args = props;
