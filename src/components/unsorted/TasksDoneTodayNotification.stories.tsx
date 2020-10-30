import React from 'react';
import useToggle from 'react-use/lib/useToggle';
import { Button } from '@material-ui/core';
import { sections } from '../storybookContants';
import { TasksDoneTodayNotification } from './TasksDoneTodayNotification';
import { TasksDoneTodaySampleProps } from '../dataMocks';

export default {
  component: TasksDoneTodayNotification,
  title: `${sections.tasks}TasksDoneTodayNotification`,
};

export const Normal = () => {
  const [isOpen, toggleVisibility] = useToggle(true);
  return (
    <>
      <TasksDoneTodayNotification
        isVisible={isOpen}
        {...TasksDoneTodaySampleProps}
        toggleVisibility={toggleVisibility}
      />
      <Button onClick={() => toggleVisibility()}>
        Toggle drawer
      </Button>
    </>
  );
};
