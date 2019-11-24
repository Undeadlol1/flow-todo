import React, { memo } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import MUIFab, { FabProps } from '@material-ui/core/Fab';
import cx from 'clsx';

export const useFabStyles = makeStyles(theme => ({
  fab: {
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

const Fab = (props: FabProps) => {
  const classes = useFabStyles();
  return (
    <MUIFab
      color="primary"
      {...props}
      className={cx([classes.fab, props.className])}
    />
  );
};

export default memo(Fab);
