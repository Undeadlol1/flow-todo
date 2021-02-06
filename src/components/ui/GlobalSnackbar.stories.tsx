import React from 'react';
import { sections } from '../storybookContants';
import {
  GlobalSnackbar,
  GlobalSnackbarProps,
} from './GlobalSnackbar';

export default {
  component: GlobalSnackbar,
  title: `${sections.ui}GlobalSnackbar`,
};

export const Demo = (args) => <GlobalSnackbar {...args} />;

Demo.args = {
  open: true,
  message: 'This is a message',
  onClose: () => console.log('onClose() was called.'),
} as GlobalSnackbarProps;
