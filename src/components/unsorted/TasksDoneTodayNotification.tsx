import { Box, Drawer, Theme } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import classNames from 'classnames';
import debug from 'debug';
import React, { memo } from 'react';
import TasksDoneToday, {
  TasksDoneTodayProps,
} from '../tasks/TasksDoneToday';

const log = debug('TasksDoneTodayNotification');

const useStyles = makeStyles((theme: Theme) => ({ root: {} }));

export interface TasksDoneTodayNotificationProps
  extends TasksDoneTodayProps {
  isVisible: boolean;
  toggleVisibility: (isOpen?: boolean) => void;
  className?: string;
}

const TasksDoneTodayNotification = memo(
  ({
    isVisible,
    toggleVisibility,
    ...props
  }: TasksDoneTodayNotificationProps) => {
    const anchor = 'top';
    const classes = useStyles();
    const rootClasses = classNames(classes.root, props.className);
    log('isVisible: ', isVisible);

    return (
      <Box className={rootClasses}>
        <Drawer
          anchor={anchor}
          open={isVisible}
          onClose={() => toggleVisibility()}
        >
          <TasksDoneToday {...props} />
        </Drawer>
      </Box>
    );
  },
);

TasksDoneTodayNotification.displayName = 'TasksDoneTodayNotification';

export { TasksDoneTodayNotification };
