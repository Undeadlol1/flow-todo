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

const props = {
  _isOpenForDevPurposes: true,
} as GlobalSnackbarProps;

export const Demo = (args) => <GlobalSnackbar {...args} />;
Demo.args = props;
