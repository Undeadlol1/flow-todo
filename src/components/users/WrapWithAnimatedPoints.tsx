import { useTypedSelector } from '../../store';
import React, { memo, ReactElement } from 'react';
import { animationSelector } from '../../store/selectors';
import { WrapWithAnimatedNumbers } from '../unsorted/WrapWithAnimatedNumbers';
import { Box } from '@material-ui/core';
import classNames from 'classnames';

export const WrapWithAnimatedPoints = memo(
  function WrapWithAnimatedPoints(props: {
    className?: string;
    children: ReactElement;
  }) {
    const state = useTypedSelector(animationSelector);
    return (
      <Box className={classNames(props.className)}>
        <WrapWithAnimatedNumbers
          placement="top"
          isVisible={state.isPointsRewardingInProgress}
          number={state.pointToDisplayDuringRewardAnimation}
        >
          {props.children}
        </WrapWithAnimatedNumbers>
      </Box>
    );
  },
);
