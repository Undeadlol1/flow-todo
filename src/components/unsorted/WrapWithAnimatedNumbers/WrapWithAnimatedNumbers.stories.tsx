import { Avatar } from '@material-ui/core';
import React, { useEffect } from 'react';
import { sections } from '../../storybookContants';
import {
  WrapWithAnimatedNumbers,
  WrapWithAnimatedNumbersProps,
} from './WrapWithAnimatedNumbers';
import useToggle from 'react-use/esm/useToggle';

export default {
  component: WrapWithAnimatedNumbers,
  title: `${sections.ui}WrapWithAnimatedNumbers`,
};

const props = {
  number: 100,
  isVisible: false,
  children: (
    <Avatar src="https://i.picsum.photos/id/1025/200/200.jpg?hmac=lPP7DRqIRSrMTmBMEg5NbVzguwqQQs2meA5kSrgLAhc" />
  ),
} as WrapWithAnimatedNumbersProps;

export const Demo = (args) => {
  const [isVisible, toggleVisibility] = useToggle(false);
  useEffect(() => {
    const interval = setInterval(toggleVisibility, 3000);
    return () => clearInterval(interval);
  }, [toggleVisibility]);

  return <WrapWithAnimatedNumbers {...args} isVisible={isVisible} />;
};
Demo.args = props;
