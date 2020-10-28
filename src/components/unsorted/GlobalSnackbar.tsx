import { Snackbar } from '@material-ui/core';
import { delay } from 'lodash';
import React, { memo, useEffect, useState } from 'react';
import useToggle from 'react-use/lib/useToggle';
import { useTypedSelector } from '../../store';
import isEmpty from 'lodash/isEmpty';
import { useDispatch } from 'react-redux';
import { setSnackbars } from '../../store/uiSlice';

export interface GlobalSnackbarProps {
  _isOpenForDevPurposes?: boolean;
}

const GlobalSnackbar = memo(
  ({ _isOpenForDevPurposes = false }: GlobalSnackbarProps) => {
    const snackbarsInQueue = useTypedSelector(
      state => state.ui.snackbars,
    );
    console.log('snackbarsInQueue: ', snackbarsInQueue);
    const dispatch = useDispatch();
    const [isDialogOpen, toggleDialog] = useToggle(
      _isOpenForDevPurposes,
    );
    const [snackbarMessage, setSnackbarMessage] = useState('');

    function displayFirstSnackbarInQueue() {
      if (isDialogOpen || isEmpty(snackbarsInQueue)) {
        return;
      }
      const snackbarToActivate = snackbarsInQueue[0];

      setSnackbarMessage(snackbarToActivate);
      toggleDialog();
      delay(() => {
        toggleDialog();
        dispatch(
          setSnackbars(
            snackbarsInQueue.filter(i => i !== snackbarToActivate),
          ),
        );
      }, 3500);
    }

    useEffect(displayFirstSnackbarInQueue, [snackbarsInQueue]);

    return (
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        open={isDialogOpen}
        onClose={toggleDialog}
        // autoHideDuration={6000}
        message={snackbarMessage}
      />
    );
  },
);

GlobalSnackbar.displayName = 'GlobalSnackbar';

export { GlobalSnackbar };
