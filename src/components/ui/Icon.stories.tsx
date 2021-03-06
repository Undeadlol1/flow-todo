import React from 'react';
import { sections } from '../storybookContants';
import { Icon, IconProps } from './Icon';

export default {
  component: Icon,
  title: `${sections.ui}Icon`,
};

const props = {
  code: 'happy_face',
} as IconProps;

export const Demo = (args) => (
  <div>
    <Icon code="happy_face" />
    <Icon code="sad_face" />
    <h2>Use controls to change: </h2>
    <Icon {...args} />
    <h2>Sizes: </h2>
    <Icon {...args} size="small" />
    <Icon {...args} size="default" />
    <Icon {...args} size="big" />
  </div>
);
Demo.args = props;
