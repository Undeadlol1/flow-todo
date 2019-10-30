import React from 'react';
import TasksList from './TasksList'
import { random } from 'faker'

export default {
    component: TasksList,
    title: 'TasksList',
};

export const empty = () => <TasksList />;

const tasks = [];
for (let i = 0; i < 10; i++) {
    tasks.push({
        id: random.uuid(),
        name: random.word(),
    })
}

export const withItems = () => <TasksList tasks={tasks} />

withItems.title = "With items"
