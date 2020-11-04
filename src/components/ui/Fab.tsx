import { Theme } from '@material-ui/core';
import MUIFab, { FabProps } from '@material-ui/core/Fab';
import { makeStyles } from '@material-ui/styles';
import cx from 'clsx';
import React, { memo } from 'react';

export const useFabStyles = makeStyles((theme: Theme) => ({
  fab: {
    zIndex: 1300,
    position: 'fixed',
    [theme.breakpoints.down('sm')]: {
      bottom: theme.spacing(3),
      right: theme.spacing(2),
    },
    [theme.breakpoints.up('md')]: {
      bottom: theme.spacing(5),
      right: theme.spacing(4),
    },
    [theme.breakpoints.up('lg')]: {
      bottom: theme.spacing(7),
      right: theme.spacing(8),
    },
  },
}));

interface Props extends FabProps {
  isHidden?: boolean;
}

const Fab = ({ isHidden, ...props }: Props) => {
  const classes = useFabStyles();

  if (isHidden) return null;
  return (
    <MUIFab
      color="primary"
      {...props}
      className={cx([classes.fab, props.className])}
    />
  );
};

export default memo(Fab);
