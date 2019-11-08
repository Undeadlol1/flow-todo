import React from 'react';
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
import { useTranslation } from 'react-i18next';

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
      width: '100%',
      padding: theme.spacing(1),
    },
  };
});

export function SubtasksList({ loading, tasks, deleteTask }) {
  const [t] = useTranslation();
  const classes = useStyles();
  console.log('classes: ', classes);
  if (loading) return null;
  if (!tasks || tasks.empty) return null;
  return (
    <Paper elevation={6} className={classes.paper}>
      <Typography className={classes.title} variant="subtitle1">
        {`${t('subtasks')}:`}
      </Typography>
      {/* TODO: checkboxes */}
      {/* https://material-ui.com/components/lists/#checkbox */}
      <List className={classes.list}>
        {tasks.map(task => (
          <ListItem
            key={task.id}
            className={classes.link}
          >
            <ListItemText primary={task.name} />
            <ListItemSecondaryAction>
              <IconButton
                edge="end"
                aria-label="Delete"
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

SubtasksList.defaultProps = {
  tasks: [],
  loading: false,
};

SubtasksList.propTypes = {
  loading: PropTypes.bool,
  tasks: PropTypes.array,
  deleteTask: PropTypes.func.isRequired,
};

const lastSixteenHours = subtractHours(new Date(), 16).getTime();

export default function SubtasksListContainer(props) {
  const [user] = useAuthState(auth());
  const db = firestore().collection('tasks');
  const [tasks, loading, error] = useCollection(
    user && db
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

  return <SubtasksList {...mergeProps} />;
}
