import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { firestore, auth } from 'firebase/app';
import { useCollection } from 'react-firebase-hooks/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles(theme => {
  const color = theme.palette.text.primary;
  return {
    title: {
      color,
      display: 'block',
      textAlign: 'left',
      margin: '20px 10px 10px',
    },
    list: {
      width: '100%',
    },
    link: {
      color,
      textDecoration: 'none',
    },
  };
});

export function TasksList({ loading, tasks, deleteTask }) {
  const classes = useStyles();
  if (loading) return null;
  if (!tasks || tasks.empty) return null;
  return (
    <>
      <Typography variant="subtitle1" className={classes.title}>
        Выполненные задачи сегодня:
      </Typography>
      <List className={classes.list}>
        {tasks.docs.map(task => (
          <ListItem
            component={Link}
            to={`/tasks/${task.id}`}
            className={classes.link}
            key={task.id}
          >
            <ListItemText primary={task.data().name} />
            <ListItemSecondaryAction>
              <IconButton
                onClick={() => deleteTask(task.id)}
                edge="end"
                aria-label="Удалить"
              >
                <DeleteIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
    </>
  );
}

TasksList.defaultProps = {
  tasks: null,
  loading: false,
};

TasksList.propTypes = {
  loading: PropTypes.bool,
  tasks: PropTypes.object,
  deleteTask: PropTypes.func.isRequired,
};

const yesterday = Date.now() - 1000 * 60 * 60 * 24;

export default function CreateTaskContainer(props) {
  const [user] = useAuthState(auth());
  const db = firestore().collection('tasks');
  const [tasks, loading, error] = useCollection(
    db
      .where('userId', '==', user && user.uid)
      .where('isDone', '==', true)
      .where('doneAt', '>', yesterday),
  );

  if (error) throw error;

  const mergeProps = {
    ...props,
    tasks,
    loading,
    deleteTask: taskId => db.doc(taskId).delete(),
  };

  return <TasksList {...mergeProps} />;
}
