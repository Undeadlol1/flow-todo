import React, { useState, useEffect } from 'react';
import UserPoints from './UserPoints';
import { number } from '@storybook/addon-knobs';
import add from 'ramda/es/add';
import { sections } from '../storybookContants';

export default {
  title: sections.users + 'UserPoints',
  component: UserPoints,
};

export const normal = () => (
  <>
    <UserPoints value={10} /> <br />
    <UserPoints value={100} /> <br />
    <UserPoints value={1000} /> <br />
    <UserPoints value={10000} /> <br />
    Custom: <br />
    <UserPoints value={number('points', 10)} />
  </>
);

export const Animation = () => {
  const [points, setPoints] = useState(10);

  useEffect(() => {
    const interval = setInterval(() => setPoints(add(10)), 2000);
    return () => clearInterval(interval);
  }, []);

  return <UserPoints value={points} />;
};
