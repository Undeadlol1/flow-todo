import React from 'react';
import { UpsertTask } from './UpsertTask';

export default {
  component: UpsertTask,
  title: 'UpsertTask',
};

export const normal = () => <UpsertTask />;

export const invalid = () => <UpsertTask isValid={false} />;

export const withError = () => <UpsertTask error="Error occured" />;

withError.title = 'With error';
