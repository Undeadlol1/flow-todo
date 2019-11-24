import Chip from '@material-ui/core/Chip';
import React, { memo } from 'react';
import CountUp from 'react-countup';
import usePrevious from 'react-use/esm/usePrevious';

const UserPoints = memo(({ value: newValue }: { value: number }) => {
  const oldValue = usePrevious(newValue);
  return (
    <Chip
      color="secondary"
      label={
        <CountUp
          end={newValue}
          start={oldValue ? newValue - oldValue : 0}
        />
      }
    />
  );
});

export default UserPoints;
