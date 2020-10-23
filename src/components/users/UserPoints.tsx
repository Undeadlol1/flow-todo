import Chip from '@material-ui/core/Chip';
import Skeleton from '@material-ui/lab/Skeleton';
import debug from 'debug';
import React, { memo } from 'react';
import { NumbersAnimatedOnUpdate } from '../unsorted/NumbersAnimatedOnUpdate';

const logger = debug('UserPoints');

const UserPoints = memo(
  ({
    isLoaded,
    value: nextPoints,
  }: {
    value: number;
    isLoaded?: boolean;
  }) => {
    logger('isLoaded', isLoaded);

    if (isLoaded)
      return (
        <Chip
          color="secondary"
          label={
            isLoaded && <NumbersAnimatedOnUpdate value={nextPoints} />
          }
        />
      );
    else
      return <Skeleton variant="circle" width="33px" height="33px" />;
  },
  function(previousProps, nextProps) {
    if (previousProps.isLoaded !== nextProps.isLoaded) return false;
    // There is a strange bug where on window resize
    // state resets and value is 0. Then it data is fetched again.
    if (nextProps.value === 0) return true;
    return false;
  },
);

export default UserPoints;
