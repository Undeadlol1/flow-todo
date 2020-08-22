import React from 'react';
import useToggle from 'react-use/lib/useToggle';
import ToggleEncouragingMessages from './ToggleEncouragingMessages';

export default {
  title: 'ToggleEncouragingMessages',
  component: ToggleEncouragingMessages,
};

export const Normal = () => {
  const [value, toggleValue] = useToggle(false);
  return (
    <ToggleEncouragingMessages value={value} onChange={toggleValue} />
  );
};
