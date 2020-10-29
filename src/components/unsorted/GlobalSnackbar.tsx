import { Snackbar } from '@material-ui/core';
import { delay } from 'lodash';
import React, { memo, useEffect } from 'react';
import useToggle from 'react-use/lib/useToggle';

export interface GlobalSnackbarProps {
  _isOpenForDevPurposes?: boolean;
}

const GlobalSnackbar = memo(
  ({ _isOpenForDevPurposes = false }: GlobalSnackbarProps) => {
    const [isDialogOpen, toggleDialog] = useToggle(
      _isOpenForDevPurposes,
    );

    useEffect(() => {
      if (isDialogOpen) {
        delay(toggleDialog, 3500);
      }
    }, [isDialogOpen, toggleDialog]);

    return (
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        open={isDialogOpen}
        message="Note archived"
        // autoHideDuration={6000}
        onClose={toggleDialog}
      />
    );
  },
);

GlobalSnackbar.displayName = 'GlobalSnackbar';

export { GlobalSnackbar };
