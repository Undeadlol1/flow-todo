import React from 'react';
import PropTypes from 'prop-types';
import { firestore } from 'firebase/app';
import { useCollection } from 'react-firebase-hooks/firestore';
import CircularProgress from '@material-ui/core/CircularProgress';

export const TasksListContainer = (props) => {
  const [value, loading] = useCollection(
    firestore().collection('tasks'),
  );
  return <TasksList {...{ tasks: value, ...props, loading }} />;
};

export default function TasksList(props) {
  if (props.loading) return <CircularProgress />;
  console.log('props.tasks: ', props.tasks);
  if (props.tasks.empty) return <h1>No tasks</h1>;
  return (
    <ul>
      {props.tasks.docs.map((task) => <li key={task.id}>{task.data().name}</li>)}
    </ul>
  );
}

TasksList.defaultProps = {
  tasks: {},
  loading: false,
};

TasksList.propTypes = {
  loading: PropTypes.bool,
  tasks: PropTypes.object,
};
