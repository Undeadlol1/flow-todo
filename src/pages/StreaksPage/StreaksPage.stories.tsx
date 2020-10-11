import React from 'react';
import { StreaksPage } from './StreaksPage';
import { sections } from '../../components/storybookContants';

export default {
  component: StreaksPage,
  title: sections.pages + 'StreaksPage',
};

export const Normal = () => {
  return <StreaksPage />;
};
