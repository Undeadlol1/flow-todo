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

export const Normal = (args) => {
  const [isOpen, toggleVisibility] = useToggle(true);
  return (
    <>
      <TasksDoneTodayNotification
        args
        isVisible={isOpen}
        {...args}
        toggleVisibility={toggleVisibility}
      />
      <Button onClick={() => toggleVisibility()}>
        Toggle drawer
      </Button>
    </>
  );
};
Normal.args = TasksDoneTodaySampleProps;
