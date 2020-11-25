import React, { memo, ReactElement } from 'react';
import { Box, Theme } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { NumbersAnimatedOnUpdate } from '../../ui/NumbersAnimatedOnUpdate';
import { When } from 'react-if';

const useStyles = makeStyles((theme: Theme) => ({ root: {} }));

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
      <Box>{props.children}</Box>
      <Box>
        <When condition={props.isVisible}>
          <NumbersAnimatedOnUpdate value={props.number} />
        </When>
      </Box>
    </Box>
  );
});

WrapWithAnimatedNumbers.displayName = 'WrapWithAnimatedNumbers';

export { WrapWithAnimatedNumbers };
