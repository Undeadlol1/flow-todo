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
  className?: string;
  children: ReactElement;
  placement: 'top' | 'bottom';
}

const WrapWithAnimatedNumbers = memo(function WrapWithAnimatedNumbers(
  props: WrapWithAnimatedNumbersProps,
) {
  const classes = useStyles();
  const rootClasses = classNames(classes.root, props.className);
  const numbersPlacement = classNames(classes.numbersWrapper, {
    [classes.topPlacement]: props.placement === 'top',
    [classes.bottomPlacement]: props.placement === 'bottom',
  });

  return (
    <Box className={rootClasses}>
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
