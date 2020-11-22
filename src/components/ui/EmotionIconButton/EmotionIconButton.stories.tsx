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
  type: 'blissful_face',
  onClick: console.log,
} as EmotionIconButtonProps;

export const Demo = (args) => {
  return (
    <div>
      <EmotionIconButton {...args} />
      <EmotionIconButton type="happy_face" />
      <EmotionIconButton type="sad_face" />
      <EmotionIconButton type="ko_face" />
    </div>
  );
};
Demo.args = props;
