import { Box, Fade, Theme } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import React, { memo, ReactElement } from 'react';
import { NumbersAnimatedOnUpdate } from '../../ui/NumbersAnimatedOnUpdate';

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
        <Fade in={props.isVisible}>
          <NumbersAnimatedOnUpdate value={props.number} />
        </Fade>
      </Box>
    </Box>
  );
});

export { WrapWithAnimatedNumbers };
