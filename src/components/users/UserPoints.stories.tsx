import React, { useState, useEffect } from 'react';
import { number, boolean } from '@storybook/addon-knobs';
import add from 'ramda/es/add';
import UserPoints from './UserPoints';
import { sections } from '../storybookContants';

export default {
  title: `${sections.users}UserPoints`,
  component: UserPoints,
};

export const normal = () => (
  <>
    Loading:
    {' '}
    <br />
    <UserPoints isLoaded={false} value={10} />
    Variants:
    {' '}
    <br />
    <UserPoints isLoaded value={10} />
    {' '}
    <br />
    <UserPoints isLoaded value={100} />
    {' '}
    <br />
    <UserPoints isLoaded value={1000} />
    {' '}
    <br />
    <UserPoints isLoaded value={10000} />
    {' '}
    <br />
    Use knobs to change:
    {' '}
    <br />
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

  return <UserPoints isLoaded value={points} />;
};
