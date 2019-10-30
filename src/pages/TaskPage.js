import React from 'react';
import PropTypes from 'prop-types';
import { firestore } from 'firebase/app';
import { useParams } from 'react-router-dom';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import CircularProgress from '@material-ui/core/CircularProgress';

export function TaskPage(props) {
  if (props.loading) return <CircularProgress />;
  return (
    <div>
      <h2>{props.task.name}</h2>
    </div>
  );
}

TaskPage.propTypes = {
  task: PropTypes.object,
  loading: PropTypes.bool.isRequired,
  taskId: PropTypes.string.isRequired,
};

export default (props) => {
  const { taskId } = useParams();
  const [task, loading] = useDocumentData(
    firestore().collection('tasks').doc(taskId),
  );
  const mergedProps = {
    task, loading, taskId, ...props,
  };
  return (
    <TaskPage {...mergedProps} />
  );
};
