import { Box, Fade, Theme, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import classNames from 'classnames';
import React, { memo, ReactElement } from 'react';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    position: 'relative',
    display: 'inline-block',
  },
  numbersWrapper: {
    left: 'auto',
    width: '100%',
    textAlign: 'center',
    position: 'absolute',
  },
  topPlacement: {
    top: theme.spacing(4) * -1,
  },
  bottomPlacement: {
    bottom: theme.spacing(4) * -1,
  },
}));

export interface WrapWithAnimatedNumbersProps {
  number: number;
  isVisible: boolean;
  children: ReactElement;
  placement: 'top' | 'bottom';
}

const WrapWithAnimatedNumbers = memo(function WrapWithAnimatedNumbers(
  props: WrapWithAnimatedNumbersProps,
) {
  const classes = useStyles();
  const numbersPlacement = classNames(classes.numbersWrapper, {
    [classes.topPlacement]: props.placement === 'top',
    [classes.bottomPlacement]: props.placement === 'bottom',
  });

  return (
    <Box className={classes.root}>
      <Box>{props.children}</Box>
      <Box className={numbersPlacement}>
        <Fade mountOnEnter unmountOnExit in={props.isVisible}>
          <Typography>+ {props.number}</Typography>
        </Fade>
      </Box>
    </Box>
  );
});

export { WrapWithAnimatedNumbers };
