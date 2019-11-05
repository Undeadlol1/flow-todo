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
import subtractHours from 'date-fns/subHours';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles(theme => {
  const color = theme.palette.text.primary;
  return {
    title: {
      color,
      display: 'block',
      textAlign: 'left',
      margin: '0 10px',
    },
    list: {
      width: '100%',
    },
    link: {
      color,
      textDecoration: 'none',
    },
     paper: {
      padding: theme.spacing(1),
    },
  };
});

export function TasksList({ loading, tasks, deleteTask }) {
  const classes = useStyles();
  if (loading) return null;
  if (!tasks || tasks.empty) return null;
  return (
    <Paper className={classes.paper}>
      <Typography className={classes.title} variant="subtitle1">
        Выполненные задачи сегодня:
      </Typography>
      <List className={classes.list}>
        {tasks.docs.map(task => (
          <ListItem
            key={task.id}
            component={Link}
            className={classes.link}
            to={`/tasks/${task.id}`}
          >
            <ListItemText primary={task.data().name} />
            <ListItemSecondaryAction>
              <IconButton
                edge="end"
                aria-label="Удалить"
                onClick={() => deleteTask(task.id)}
              >
                <DeleteIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
    </Paper>
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

const lastSixteenHours = subtractHours(new Date(), 16).getTime();

export default function CreateTaskContainer(props) {
  const [user] = useAuthState(auth());
  const db = firestore().collection('tasks');
  const [tasks, loading, error] = useCollection(
    db
      .where('userId', '==', user && user.uid)
      .where('isDone', '==', true)
      .where('doneAt', '>', lastSixteenHours),
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
