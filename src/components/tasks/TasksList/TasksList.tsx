import { Theme } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import DeleteIcon from '@material-ui/icons/Delete';
import Pagination from '@material-ui/lab/Pagination';
import debug from 'debug';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import slice from 'lodash/slice';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { When } from 'react-if';
import { Link } from 'react-router-dom';
import { Task, useTypedSelector } from '../../../store/index';
import { tasksSelector } from '../../../store/selectors';

const log = debug('TasksList');

const tasksPerPage = 7;

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
    textWrapper: {
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      [theme.breakpoints.down('sm')]: {
        whiteSpace: 'nowrap',
        maxWidth: '100%',
      },
    },
    text: {
      display: 'inline',
    },
    paper: {
      margin: '0 auto',
      padding: theme.spacing(1),
    },
  };
});

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
  const [page, setPage] = useState(1);

  const sliceTasksTo = tasksPerPage * page;
  const sliceTasksFrom = tasksPerPage * (page - 1);
  const numberOfPAges =
    Number((tasks.length / tasksPerPage).toFixed()) + 1;

  log('tasks: %O', tasks);
  log('page: ', page);
  log('tasksPerPage * page: ', tasksPerPage * page);
  log('numberOfPAges: ', numberOfPAges);

  if (loading) return null;
  if (isEmpty(tasks) || get(tasks, 'empty')) return null;
  return (
    <Paper className={classes.paper}>
      <List className={classes.list}>
        {slice(tasks, sliceTasksFrom, sliceTasksTo).map((task) => (
          <ListItem
            key={task.id}
            component={Link}
            className={classes.link}
            to={`/tasks/${task.id}`}
          >
            <ListItemText
              primary={get(task, 'subtasks[0].name', task.name)}
              classes={{
                primary: classes.text,
                root: classes.textWrapper,
              }}
            />
            <When condition={!!canDelete}>
              <ListItemSecondaryAction>
                <IconButton
                  edge="end"
                  aria-label="Delete"
                  onClick={() => deleteTask && deleteTask(task.id)}
                >
                  <DeleteIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </When>
          </ListItem>
        ))}
      </List>
      <When condition={tasks.length > tasksPerPage}>
        <Box display="flex" justifyContent="center">
          <Pagination
            count={numberOfPAges}
            onChange={(e, pageNumber) => setPage(pageNumber)}
          />
        </Box>
      </When>
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
