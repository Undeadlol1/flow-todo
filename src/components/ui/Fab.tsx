import React, { memo } from 'react';
import { makeStyles } from '@material-ui/styles';
import MUIFab, { FabProps } from '@material-ui/core/Fab';
import cx from 'clsx';
import Zoom from '@material-ui/core/Zoom';
import { Theme } from '@material-ui/core';

export const useFabStyles = makeStyles((theme: Theme) => ({
  fab: {
    zIndex: 1300,
    position: 'fixed',
    [theme.breakpoints.down('sm')]: {
      bottom: theme.spacing(2),
      right: theme.spacing(2),
    },
    [theme.breakpoints.up('md')]: {
      bottom: theme.spacing(4),
      right: theme.spacing(4),
    },
    [theme.breakpoints.up('lg')]: {
      bottom: theme.spacing(6),
      right: theme.spacing(8),
    },
  },
}));

interface Props extends FabProps {
  isHidden?: any;
}

const Fab = ({ isHidden, ...props }: Props) => {
  const classes = useFabStyles();

  if (isHidden) return null;
  else
    return (
      <Zoom in>
        <MUIFab
          color="primary"
          {...props}
          className={cx([classes.fab, props.className])}
        />
      </Zoom>
    );
};

export default memo(Fab);
