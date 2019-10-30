import React from 'react';
import CreateTask from './CreateTask'

export default {
    component: CreateTask,
    title: 'CreateTask',
};

export const normal = () => <CreateTask />;

export const invalid = () => <CreateTask isValid={false} />

export const withError = () => <CreateTask error="Error occured" />

withError.title = "With error"
