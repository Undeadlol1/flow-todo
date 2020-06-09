import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import Paper from '@material-ui/core/Paper';
import { useTranslation } from 'react-i18next';
import { When } from 'react-if';
import isEmpty from 'lodash/isEmpty';
import { TasksContext } from '../../../store/contexts';

const useStyles = makeStyles(theme => {
  const color = theme.palette.text.primary;
  return {
    list: {
      width: '100%',
    },
    link: {
      color,
      textDecoration: 'none',
    },
    text: {
      overflow: 'hidden',
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis',
    },
    paper: {
      padding: theme.spacing(1),
    },
  };
});

export function TasksList({
 loading, tasks, canDelete, deleteTask,
}) {
  const [t] = useTranslation();
  const classes = useStyles();
  if (loading) return null;
  if (isEmpty(tasks) || tasks.empty) return null;
  return (
    <Paper elevation={6} className={classes.paper}>
      <ListSubheader>{t('tasks completed today')}</ListSubheader>
      <List className={classes.list}>
        {tasks.docs.map(task => (
          <ListItem
            key={task.id}
            component={Link}
            className={classes.link}
            to={`/tasks/${task.id}`}
          >
            <ListItemText
              className={classes.text}
              primary={task.data().name}
            />
            <When condition={canDelete}>
              <ListItemSecondaryAction>
                <IconButton
                  edge="end"
                  aria-label="Delete"
                  onClick={() => deleteTask(task.id)}
                >
                  <DeleteIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </When>
          </ListItem>
        ))}
      </List>
    </Paper>
  );
}

TasksList.defaultProps = {
  tasks: null,
  loading: false,
  canDelete: false,
};

TasksList.propTypes = {
  loading: PropTypes.bool,
  tasks: PropTypes.object,
  canDelete: PropTypes.bool,
  deleteTask: PropTypes.func,
};

export default function TasksListContainer(props) {
  const { tasksDoneToday, error, loading } = useContext(TasksContext);

  if (error) console.error(error);

  const mergeProps = {
    ...props,
    loading,
    tasks: tasksDoneToday,
  };

  return <TasksList {...mergeProps} />;
}
