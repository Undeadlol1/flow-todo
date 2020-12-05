import { Box, Typography } from '@material-ui/core';
import React, { useEffect } from 'react';
import useToggle from 'react-use/esm/useToggle';
import { sections } from '../../storybookContants';
import {
  WrapWithAnimatedNumbers,
  WrapWithAnimatedNumbersProps,
} from './WrapWithAnimatedNumbers';

export default {
  component: WrapWithAnimatedNumbers,
  title: `${sections.ui}WrapWithAnimatedNumbers`,
};

const props = {
  number: 100,
  isVisible: true,
  placement: 'bottom',
  children: (
    <Box p="60px" width="200px" height="200px" border="1px red solid">
      <Typography align="center">
        This is some element to wrap.
      </Typography>
    </Box>
  ),
} as WrapWithAnimatedNumbersProps;

export const Demo = (args) => {
  const [isVisible, toggleVisibility] = useToggle(false);
  useEffect(() => {
    const interval = setInterval(toggleVisibility, 3000);
    return () => clearInterval(interval);
  }, [toggleVisibility]);

  return (
    <>
      <WrapWithAnimatedNumbers {...args} isVisible={isVisible} />
      <Box
        mt={6}
        p="50px"
        width="200px"
        height="200px"
        border="1px red solid"
      >
        <Typography align="center">
          This is some elemtn beneath the wrapped one.
        </Typography>
      </Box>
    </>
  );
};
Demo.args = props;

export const Placement = (args) => (
  <>
    <Box>Top placement:</Box>
    <WrapWithAnimatedNumbers {...args} placement="top" />
    <Box mb={4} />
    <Box>Bottom placement:</Box>
    <WrapWithAnimatedNumbers {...args} />
  </>
);
Placement.args = props;
