import React, { useState, useEffect } from 'react';
import UserPoints from './UserPoints';
import { number, boolean } from '@storybook/addon-knobs';
import add from 'ramda/es/add';
import { sections } from '../storybookContants';

export default {
  title: sections.users + 'UserPoints',
  component: UserPoints,
};

export const normal = () => (
  <>
    Loading: <br />
    <UserPoints isLoaded={false} value={10} />
    Variants: <br />
    <UserPoints value={10} isLoaded /> <br />
    <UserPoints value={100} isLoaded /> <br />
    <UserPoints value={1000} isLoaded /> <br />
    <UserPoints value={10000} isLoaded /> <br />
    Use knobs to change: <br />
    <UserPoints
      value={number('points', 10)}
      isLoaded={boolean('is loading', true)}
    />
  </>
);

export const Animation = () => {
  const [points, setPoints] = useState(10);

  useEffect(() => {
    const interval = setInterval(() => setPoints(add(10)), 2000);
    return () => clearInterval(interval);
  }, []);

  return <UserPoints value={points} isLoaded={true} />;
};
