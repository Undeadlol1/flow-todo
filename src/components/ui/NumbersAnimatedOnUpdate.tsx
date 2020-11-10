import debug from 'debug';
import React, { memo } from 'react';
import CountUp from 'react-countup';
import usePrevious from 'react-use/lib/usePrevious';

const log = debug('NumbersAnimatedOnUpdate');

interface Props {
  value: number;
  isAnimationDisabled?: boolean;
}

const NumbersAnimatedOnUpdate = memo(
  ({ value: nextPoints, isAnimationDisabled }: Props) => {
    const previousPoints = usePrevious(nextPoints) || 0;
    const difference = nextPoints - previousPoints;
    log('nextPoints: ', nextPoints);
    log('previousPoints: ', previousPoints);
    log('difference: ', difference);

    if (isAnimationDisabled) {
      return <>{nextPoints}</>;
    }
    return (
      <CountUp
        end={nextPoints}
        start={previousPoints && nextPoints - difference}
      />
    );
  },
);

NumbersAnimatedOnUpdate.displayName = 'NumbersAnimatedOnUpdate';

export { NumbersAnimatedOnUpdate };
