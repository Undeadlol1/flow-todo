import React, { memo } from 'react';
import Chip from '@material-ui/core/Chip';
import CountUp from 'react-countup';

const UserPoints = memo((props: { value: number }) => (
  <Chip
    color="secondary"
    label={<CountUp start={0} end={props.value} />}
  />
));

export default UserPoints;
