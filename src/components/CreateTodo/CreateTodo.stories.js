import React from 'react';
import CreateTodo from './CreateTodo'

export default {
    component: CreateTodo,
    title: 'CreateTodo',
};

export const normal = () => <CreateTodo />;

export const withError = () => <CreateTodo />

withError.title = 'With error'