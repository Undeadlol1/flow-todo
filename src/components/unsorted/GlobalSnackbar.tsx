import { Snackbar } from '@material-ui/core';
import { delay, uniq } from 'lodash';
import React, { memo, useEffect, useState } from 'react';
import useToggle from 'react-use/lib/useToggle';
import { useTypedSelector } from '../../store';
import isEmpty from 'lodash/isEmpty';
import { useDispatch } from 'react-redux';
import { setSnackbars } from '../../store/snackbarsSlice';
import filter from 'lodash/filter';

export interface GlobalSnackbarProps {
  _isOpenForDevPurposes?: boolean;
}

const GlobalSnackbar = memo(
  ({ _isOpenForDevPurposes = false }: GlobalSnackbarProps) => {
    const snackbarsInQueue = useTypedSelector(
      state => state.snackbars.snackbars,
    );
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
      toggleDialog(true);
      delay(() => {
        const snackbarsAfterFiltering = filter(
          uniq(snackbarsInQueue),
          i => {
            return snackbarToActivate !== i;
          },
        );
        toggleDialog(false);
        delay(
          () => dispatch(setSnackbars(snackbarsAfterFiltering)),
          500,
        );
      }, 3500);
    }

    useEffect(displayFirstSnackbarInQueue, [
      snackbarsInQueue,
      isDialogOpen,
    ]);

    return (
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        open={isDialogOpen}
        onClose={toggleDialog}
        message={snackbarMessage}
      />
    );
  },
);

GlobalSnackbar.displayName = 'GlobalSnackbar';

export { GlobalSnackbar };
