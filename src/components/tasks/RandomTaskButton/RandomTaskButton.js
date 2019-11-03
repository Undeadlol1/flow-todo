import React from 'react';
import PropTypes from 'prop-types';
import { firestore, auth } from 'firebase/app';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollection } from 'react-firebase-hooks/firestore';
import { Link } from 'react-router-dom';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import get from 'lodash/get';
import random from 'lodash/random';
import { makeStyles } from '@material-ui/core/styles';
import Zoom from '@material-ui/core/Zoom';
import { If, Then, Else } from 'react-if';
import Typography from '@material-ui/core/Typography';
import { useTranslation } from 'react-i18next';

const useStyles = makeStyles({
  paper: {
    padding: '100px',
  },
});

export function RandomTaskButton({ tasks, loading, className }) {
  const classes = useStyles();
  const [t] = useTranslation();

  const docs = get(tasks, 'docs', []);
  const randomTaskId = get(docs, `[${[random(docs.length - 1)]}].id`);
  const buttonText = t(randomTaskId ? 'randomTask' : 'noTasks');

  return (
    <Button
      color="primary"
      component={Link}
      className={className}
      to={`/tasks/${randomTaskId}`}
      disabled={loading || tasks.empty}
    >
      <Paper elevation={6} className={classes.paper}>
        <If condition={loading}>
          <Then><CircularProgress /></Then>
          <Else>
            <Zoom in>
              <Typography>{buttonText}</Typography>
            </Zoom>
          </Else>
        </If>
      </Paper>
    </Button>
  );
}

RandomTaskButton.propTypes = {
  className: PropTypes.string,
  loading: PropTypes.bool.isRequired,
  tasks: PropTypes.object.isRequired,
};

const today = Date.now();

export default function RandomTaskButtonContainer(props) {
  const [user] = useAuthState(auth());
  const db = firestore().collection('tasks');
  const [tasks, loading, error] = useCollection(
    db
      .where('userId', '==', user && user.uid)
      .where('isDone', '==', false)
      .where('dueAt', '<', today),
  );
  if (error) throw error;
  return (
    <RandomTaskButton
      {...{
        ...props,
        loading,
        tasks: tasks || {},
        deleteTask: taskId => db.doc(taskId).delete(),
      }}
    />
  );
}
