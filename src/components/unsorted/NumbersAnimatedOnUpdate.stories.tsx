import { add } from 'ramda';
import React, { useEffect, useState } from 'react';
import { sections } from '../storybookContants';
import { NumbersAnimatedOnUpdate } from './NumbersAnimatedOnUpdate';

export default {
  component: NumbersAnimatedOnUpdate,
  title: `${sections.ui}NumbersAnimatedOnUpdate`,
};

export const Demo = () => {
  const [points, setPoints] = useState(10);

  useEffect(() => {
    const interval = setInterval(() => setPoints(add(10)), 2000);
    return () => clearInterval(interval);
  }, []);

  return <NumbersAnimatedOnUpdate value={points} />;
};
