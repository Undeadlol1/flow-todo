import { Box, Fade, Theme, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import React, { memo, ReactElement } from 'react';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    position: 'relative',
    display: 'inline-block',
  },
  wrappedChild: {},
  numbersWrapper: {
    left: 'auto',
    width: '100%',
    textAlign: 'center',
    position: 'absolute',
    bottom: theme.spacing(4) * -1,
  },
}));

export interface WrapWithAnimatedNumbersProps {
  number: number;
  isVisible: boolean;
  children: ReactElement;
}

const WrapWithAnimatedNumbers = memo(function WrapWithAnimatedNumbers(
  props: WrapWithAnimatedNumbersProps,
) {
  const classes = useStyles();

  return (
    <Box className={classes.root}>
      <Box className={classes.wrappedChild}>{props.children}</Box>
      <Box className={classes.numbersWrapper}>
        <Fade mountOnEnter unmountOnExit in={props.isVisible}>
          <Typography>+{props.number}</Typography>
        </Fade>
      </Box>
    </Box>
  );
});

export { WrapWithAnimatedNumbers };
