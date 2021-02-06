import { Snackbar, Theme, withStyles } from '@material-ui/core';
import delay from 'lodash/delay';
import filter from 'lodash/filter';
import isEmpty from 'lodash/isEmpty';
import uniq from 'lodash/uniq';
import React, { memo, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import useToggle from 'react-use/lib/useToggle';
import SnackbarService from '../../services/Snackbar';
import { snackbarsSelector, uiSelector } from '../../store/selectors';
import debug from 'debug';

const log = debug('GlobalSnackbar');

const StyledSnackbar = withStyles((theme: Theme) => ({
  root: {
    zIndex: theme.zIndex.tooltip,
  },
}))(Snackbar);

export interface GlobalSnackbarProps {
  open: boolean;
  message: string;
  onClose: () => void;
}

const GlobalSnackbar = memo((props: GlobalSnackbarProps) => {
  return (
    <StyledSnackbar
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'center',
      }}
      open={props.open}
      message={props.message}
      onClose={props.onClose}
    />
  );
});

const GlobalSnackbarContainer = memo(() => {
  const {
    isSnackbarShown,
    snackbarMessage,
    toggleSnackbar,
  } = useSnackbars();
  return (
    <GlobalSnackbar
      open={isSnackbarShown}
      message={snackbarMessage}
      onClose={() => toggleSnackbar()}
    />
  );
});

function useSnackbars(): {
  snackbarQueue: string[];
  snackbarMessage: string;
  isSnackbarShown: boolean;
  toggleSnackbar: (boolean?: boolean) => void;
} {
  const [isDialogOpen, toggleSnackbar] = useToggle(false);
  const { isTasksDoneTodayNotificationOpen } = useSelector(
    uiSelector,
  );
  const snackbarsInQueue = useSelector(snackbarsSelector).queue;
  const [snackbarMessage, setSnackbarMessage] = useState('');
  log('snackbarsInQueue: ', snackbarsInQueue);

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
      (i) => snackbarToActivate !== i,
    );

    setSnackbarMessage(snackbarToActivate);
    toggleSnackbar(true);
    delay(() => {
      toggleSnackbar(false);
      delay(
        () => SnackbarService.updateQueue(snackbarsWithoutActiveOne),
        500,
      );
    }, 3500);
  }

  useEffect(displayFirstSnackbarInQueue, [
    isDialogOpen,
    toggleSnackbar,
    snackbarsInQueue,
    isTasksDoneTodayNotificationOpen,
  ]);
  return {
    toggleSnackbar,
    snackbarQueue: [],
    isSnackbarShown: isDialogOpen,
    snackbarMessage: snackbarMessage,
  };
}

export { GlobalSnackbarContainer, GlobalSnackbar };
