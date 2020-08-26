import React from 'react';
import { sections } from '../storybookContants';
import { TasksDoneTodayNotification } from './TasksDoneTodayNotification';
import useToggle from 'react-use/lib/useToggle';
import { Button } from '@material-ui/core';
import { TasksDoneTodaySampleProps } from '../dataMocks';

export default {
  component: TasksDoneTodayNotification,
  title: sections.unsorted + 'TasksDoneTodayNotification',
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
