import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { firestore } from 'firebase/app';
import { useCollection } from 'react-firebase-hooks/firestore';
import CircularProgress from '@material-ui/core/CircularProgress';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';

export const TasksListContainer = (props) => {
  const db = firestore().collection('tasks');
  const [tasks, loading] = useCollection(db);

  function deleteTask(taskId) {
    return db.doc(taskId).delete();
  }

  return (
    <TasksList {...{
      tasks, loading, deleteTask, ...props,
    }}
    />
  );
};

export default function TasksList({ loading, tasks, deleteTask }) {
  if (loading) return <CircularProgress />;
  if (tasks.empty) return <h2>No tasks</h2>;
  return (
    <List>
      {tasks.docs.map((task) => (
        <ListItem component={Link} to={'/task/' + task.id} key={task.id}>
          <ListItemText primary={task.data().name} />
          <ListItemSecondaryAction>
            <IconButton onClick={deleteTask.bind(this, task.id)} edge="end" aria-label="Удалить">
              <DeleteIcon />
            </IconButton>
          </ListItemSecondaryAction>
        </ListItem>
      ))}
    </List>
  );
}

TasksList.defaultProps = {
  tasks: {},
  loading: false,
};

TasksList.propTypes = {
  loading: PropTypes.bool,
  tasks: PropTypes.object,
  deleteTask: PropTypes.func.isRequired,
};
