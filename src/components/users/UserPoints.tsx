import Chip from '@material-ui/core/Chip';
import React, { memo } from 'react';
import CountUp from 'react-countup';
import usePrevious from 'react-use/esm/usePrevious';
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
);

export default UserPoints;
