import React from 'react';
import { sections } from '../../components/storybookContants';
import { FocusModePage } from './FocusModePage';

export default {
  component: FocusModePage,
  title: sections.pages + 'FocusModePage',
};

const props = {};

export const Demo = (args) => <FocusModePage {...args} />;
Demo.args = props;
