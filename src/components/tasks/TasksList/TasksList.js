import React from 'react';
import isEmpty from 'lodash/isEmpty'

export default ({ tasks }) => {
    if (isEmpty(tasks)) return <h1>No tasks</h1>
    return <ul>
        {tasks.map(task => (
            <li key={task.id}>{task.name}</li>
        ))}
    </ul>
}