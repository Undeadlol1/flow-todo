import { Drawer } from '@material-ui/core';
import debug from 'debug';
import React, { memo } from 'react';
import TasksDoneToday, {
  TasksDoneTodayProps,
} from '../tasks/TasksDoneToday';

const log = debug('TasksDoneTodayNotification');

export interface TasksDoneTodayNotificationProps
  extends TasksDoneTodayProps {
  isVisible: boolean;
  toggleVisibility: (isOpen?: boolean) => void;
}

const TasksDoneTodayNotification = memo(
  function TasksDoneTodayNotification({
    isVisible,
    toggleVisibility,
    ...props
  }: TasksDoneTodayNotificationProps) {
    log('isVisible: ', isVisible);

    return (
      <Drawer
        anchor="top"
        open={isVisible}
        onClose={() => toggleVisibility()}
      >
        <TasksDoneToday {...props} />
      </Drawer>
    );
  },
);

export { TasksDoneTodayNotification };
