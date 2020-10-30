import { Snackbar } from '@material-ui/core';
import delay from 'lodash/delay';
import filter from 'lodash/filter';
import isEmpty from 'lodash/isEmpty';
import uniq from 'lodash/uniq';
import React, { memo, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import useToggle from 'react-use/lib/useToggle';
import SnackbarService from '../../services/Snackbar';
import { snackbarsSelector, uiSelector } from '../../store/selectors';

export interface GlobalSnackbarProps {
  _isOpenForDevPurposes?: boolean;
}

const GlobalSnackbar = memo(
  ({ _isOpenForDevPurposes = false }: GlobalSnackbarProps) => {
    const { isTasksDoneTodayNotificationOpen } = useSelector(
      uiSelector,
    );
    const snackbarsInQueue = useSelector(snackbarsSelector).queue;
    console.log('snackbarsInQueue: ', snackbarsInQueue);
    const [isDialogOpen, toggleDialog] = useToggle(
      _isOpenForDevPurposes,
    );
    const [snackbarMessage, setSnackbarMessage] = useState('');

    function displayFirstSnackbarInQueue() {
      if (
        isDialogOpen ||
        isEmpty(snackbarsInQueue) ||
        isTasksDoneTodayNotificationOpen
      ) {
        return;
      }

      const snackbarToActivate = snackbarsInQueue[0];
      const snackbarsWithoutActiveOne = filter(
        uniq(snackbarsInQueue),
        i => snackbarToActivate !== i,
      );

      setSnackbarMessage(snackbarToActivate);
      toggleDialog(true);
      delay(() => {
        toggleDialog(false);
        delay(
          () =>
            SnackbarService.updateQueue(snackbarsWithoutActiveOne),
          500,
        );
      }, 3500);
    }

    useEffect(displayFirstSnackbarInQueue, [
      isDialogOpen,
      snackbarsInQueue,
      isTasksDoneTodayNotificationOpen,
      toggleDialog,
    ]);

    return (
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        open={isDialogOpen}
        message={snackbarMessage}
        onClose={toggleDialog}
      />
    );
  },
);

export { GlobalSnackbar };
