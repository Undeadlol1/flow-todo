import { Snackbar } from '@material-ui/core';
import { delay, uniq } from 'lodash';
import React, { memo, useEffect, useState } from 'react';
import useToggle from 'react-use/lib/useToggle';
import { useTypedSelector } from '../../store';
import isEmpty from 'lodash/isEmpty';
import { useDispatch } from 'react-redux';
import { setSnackbars } from '../../store/uiSlice';
import filter from 'lodash/filter';

export interface GlobalSnackbarProps {
  _isOpenForDevPurposes?: boolean;
}

const GlobalSnackbar = memo(
  ({ _isOpenForDevPurposes = false }: GlobalSnackbarProps) => {
    const snackbarsInQueue = useTypedSelector(
      state => state.ui.snackbars,
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
        console.log('snackbarsInQueue: ', snackbarsInQueue);
        console.log('snackbarToActivate: ', snackbarToActivate);
        console.log(
          'snackbarsAfterFiltering: ',
          snackbarsAfterFiltering,
        );
        toggleDialog();
        dispatch(setSnackbars(snackbarsAfterFiltering));
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
        message={snackbarMessage}
      />
    );
  },
);

GlobalSnackbar.displayName = 'GlobalSnackbar';

export { GlobalSnackbar };
