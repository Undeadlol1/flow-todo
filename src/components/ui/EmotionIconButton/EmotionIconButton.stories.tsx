import React from 'react';
import { sections } from '../../storybookContants';
import {
  EmotionIconButton,
  EmotionIconButtonProps,
} from '../EmotionIconButton';

export default {
  component: EmotionIconButton,
  title: `${sections.ui}EmotionIconButton`,
};

const props = {
  type: 'happy_face',
  onClick: console.log,
} as EmotionIconButtonProps;

export const Demo = (args) => <EmotionIconButton {...args} />;
Demo.args = props;
