import React from 'react';
import { sections } from '../../components/storybookContants';
import { FocusModePage, FocusModePageProps } from './FocusModePage';
import { tasksMock } from '../../components/dataMocks';

export default {
  component: FocusModePage,
  title: sections.pages + 'FocusModePage',
};

const props = {
  isLoading: false,
  tasks: tasksMock,
} as FocusModePageProps;

export const Demo = (args) => <FocusModePage {...args} />;
Demo.args = props;
