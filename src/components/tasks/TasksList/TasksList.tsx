import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import Paper from '@material-ui/core/Paper';
import { When } from 'react-if';
import isEmpty from 'lodash/isEmpty';
import Box from '@material-ui/core/Box';
import { tasksSelector } from '../../../store/selectors';
import { useTypedSelector, Task } from '../../../store/index';
import { Theme } from '@material-ui/core';
import debug from 'debug';
import Pagination from '@material-ui/lab/Pagination';

const log = debug('TasksList');
// TODO rename
const tasksPerPage = 10;

const useStyles = makeStyles((theme: Theme) => {
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
      // whiteSpace: 'nowrap',
      textOverflow: 'ellipsis',
    },
    paper: {
      padding: theme.spacing(1),
    },
  };
});

// TODO add props types
export function TasksList({
  loading,
  tasks,
  canDelete,
  deleteTask,
}: {
  tasks: Task[];
  loading: boolean;
  canDelete?: boolean;
  deleteTask?: (id: string) => void;
}) {
  const classes = useStyles();
  if (loading) return null;
  // @ts-ignore
  if (isEmpty(tasks) || tasks.empty) return null;
  log('tasks: ', tasks);

  return (
    <Box mx="auto" component={Paper} className={classes.paper}>
      <List className={classes.list}>
        {tasks.map((task, index) => {
          if (index >= tasksPerPage) return null;
          return (
            <ListItem
              key={task.id}
              component={Link}
              className={classes.link}
              to={`/tasks/${task.id}`}
            >
              <ListItemText
                className={classes.text}
                primary={task.name}
              />
              <When condition={!!canDelete}>
                <ListItemSecondaryAction>
                  <IconButton
                    edge="end"
                    aria-label="Delete"
                    // @ts-ignore
                    onClick={() => deleteTask(task.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </When>
            </ListItem>
          );
        })}
      </List>
      <When condition={tasks.length > tasksPerPage}>
        <Box display="flex" justifyContent="center">
          <Pagination
            disabled
            count={Number((tasks.length / tasksPerPage).toFixed())}
          />
        </Box>
      </When>
    </Box>
  );
}

TasksList.defaultProps = {
  tasks: null,
  loading: false,
  canDelete: false,
};

TasksList.propTypes = {
  loading: PropTypes.bool,
  tasks: PropTypes.array,
  canDelete: PropTypes.bool,
  deleteTask: PropTypes.func,
};

// TODO add props types
export default function TasksListContainer(props: any) {
  const tasks = useTypedSelector(tasksSelector);

  const mergeProps = {
    ...props,
    loading: tasks === undefined,
    tasks,
  };

  return <TasksList {...mergeProps} />;
}
