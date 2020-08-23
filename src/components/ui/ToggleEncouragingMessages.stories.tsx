import React from 'react';
import useToggle from 'react-use/lib/useToggle';
import ToggleEncouragingMessages from './ToggleEncouragingMessages';
import { sections } from '../storybookContants';

export default {
  title: sections.users + 'ToggleEncouragingMessages',
  component: ToggleEncouragingMessages,
};

export const Normal = () => {
  const [value, toggleValue] = useToggle(false);
  return (
    <ToggleEncouragingMessages value={value} onChange={toggleValue} />
  );
};
