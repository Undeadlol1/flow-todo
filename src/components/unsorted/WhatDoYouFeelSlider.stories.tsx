import React from 'react';
import { sections } from '../storybookContants';
import {
  WhatDoYouFeelSlider,
  WhatDoYouFeelSliderProps,
} from './WhatDoYouFeelSlider';

export default {
  component: WhatDoYouFeelSlider,
  title: `${sections.ui}WhatDoYouFeelSlider`,
};

const props: WhatDoYouFeelSliderProps = {
  onChange: console.log,
};

export const Demo = (args) => <WhatDoYouFeelSlider {...args} />;
Demo.args = props;
