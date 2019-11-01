import React from 'react';
import PropTypes from 'prop-types';
import { firestore, auth } from 'firebase/app';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollection } from 'react-firebase-hooks/firestore';
import { Link } from 'react-router-dom';

import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import get from 'lodash/get';
import random from 'lodash/random';

export function RandomTaskButton({ tasks, loading }) {
  if (loading) return <CircularProgress />;
  const docs = get(tasks, 'docs', []);
  const randomTaskId = get(docs, `[${[random(0, docs.length)]}].id`);
  const buttonProps = {
    component: Link,
    color: 'primary',
    to: `/tasks/${randomTaskId}`,
    disabled: loading || tasks.empty,
  };
  return (
    <Button {...buttonProps}>test</Button>
  );
}

RandomTaskButton.propTypes = {
  loading: PropTypes.bool.isRequired,
  tasks: PropTypes.object.isRequired,
};

export default function RandomTaskButtonContainer(props) {
  const [user] = useAuthState(auth());
  const db = firestore().collection('tasks');
  const [tasks, loading] = useCollection(
    db
      .where('userId', '==', user && user.uid)
      .where('isDone', '==', false),
  ) || {};

  return (
    <RandomTaskButton {...{
      ...props,
      loading,
      tasks: tasks || {},
      deleteTask: (taskId) => db.doc(taskId).delete(),
    }}
    />
  );
}
