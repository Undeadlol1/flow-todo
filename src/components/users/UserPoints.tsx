import Chip from '@material-ui/core/Chip';
import React, { memo } from 'react';
import CountUp from 'react-countup';
import usePrevious from 'react-use/lib/usePrevious';
import debug from 'debug';

const logger = debug('UserPoints');

const UserPoints = memo(
  ({
    isLoaded = true,
    value: nextPoints,
  }: {
    value: number;
    isLoaded?: boolean;
  }) => {
    const previousPoints = usePrevious(nextPoints) || 0;
    const difference = nextPoints - previousPoints;
    logger('previousPoints', previousPoints);
    logger('nextPoints', nextPoints);
    logger('difference', difference);
    logger('isLoaded', isLoaded);
    return (
      <Chip
        color="secondary"
        label={
          isLoaded && (
            <CountUp
              end={nextPoints}
              start={previousPoints && nextPoints - difference}
            />
          )
        }
      />
    );
  },
  function(previousProps, nextProps) {
    logger('nextProps: ', nextProps);
    logger('previousProps: ', previousProps);
    // There is a strange bug where on window resize
    // state resets and value is 0. Then it data is fetched again.
    if (nextProps.value === 0) return true;
    return false;
  },
);

export default UserPoints;
