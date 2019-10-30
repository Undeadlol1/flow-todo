import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import { firestore } from 'firebase/app';
import { useParams } from 'react-router-dom';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import CircularProgress from '@material-ui/core/CircularProgress';

export function TaskPage(props) {
  if (props.loading) return <CircularProgress />;
  return (
    <Grid container>
      <h2>{props.task.name}</h2>
    </Grid>
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
