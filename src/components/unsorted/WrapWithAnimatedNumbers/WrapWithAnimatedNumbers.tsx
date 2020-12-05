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
  bottomPlacement: {
    bottom: theme.spacing(4) * -1,
  },
  topPlacement: {
    top: theme.spacing(4) * -1,
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

  return (
    <Box className={classes.root}>
      <Box>{props.children}</Box>
      <Box
        className={classNames(
          classes.numbersWrapper,
          props.placement === 'top'
            ? classes.topPlacement
            : classes.bottomPlacement,
        )}
      >
        <Fade mountOnEnter unmountOnExit in={props.isVisible}>
          <Typography>+ {props.number}</Typography>
        </Fade>
      </Box>
    </Box>
  );
});

export { WrapWithAnimatedNumbers };
