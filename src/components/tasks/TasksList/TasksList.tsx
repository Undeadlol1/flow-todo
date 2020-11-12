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
import React, { useState } from 'react';
import { When } from 'react-if';
import { Link } from 'react-router-dom';
import { tasksPerPage } from '../../../contants';
import { Task } from '../../../entities/Task';

const log = debug('TasksList');
interface TasksListProps {
  tasks: Task[];
  loading: boolean;
  canDelete?: boolean;
  deleteTask?: (id: string) => void;
}

export function TasksList({
  loading,
  tasks,
  canDelete,
  deleteTask,
}: TasksListProps) {
  const classes = useStyles();
  const [page, setPage] = useState(1);

  const sliceTasksTo = tasksPerPage * page;
  const sliceTasksFrom = tasksPerPage * (page - 1);
  const numberOfPAges =
    Number((tasks.length / tasksPerPage).toFixed()) + 1;

  log('tasks: %O', tasks);
  log('page: ', page);
  log('numberOfPAges: ', numberOfPAges);

  if (loading) return null;
  if (isEmpty(tasks) || get(tasks, 'empty')) return null;
  return (
    <Paper className={classes.paper}>
      <List className={classes.list}>
        {tasks.slice(sliceTasksFrom, sliceTasksTo).map((task) => {
          const text = get(task, 'subtasks[0].name', task.name);
          return (
            <ListItem
              key={task.id}
              component={Link}
              className={classes.link}
              to={`/tasks/${task.id}`}
            >
              <ListItemText
                primary={text}
                classes={{
                  primary: classes.text,
                  root: classes.textWrapper,
                }}
              />
              <ListItemSecondaryAction>
                <DeleteButton
                  isVisible={canDelete}
                  onClick={() => deleteTask && deleteTask(task.id)}
                />
              </ListItemSecondaryAction>
            </ListItem>
          );
        })}
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

function DeleteButton({
  isVisible: canDelete,
  onClick,
}: {
  onClick: () => void;
  isVisible: TasksListProps['canDelete'];
}) {
  return (
    <When condition={!!canDelete}>
      <IconButton
        edge="end"
        aria-label="Delete"
        onClick={() => onClick()}
      >
        <DeleteIcon />
      </IconButton>
    </When>
  );
}

function useStyles() {
  return makeStyles((theme: Theme) => {
    return {
      list: {
        width: '100%',
      },
      link: {
        textDecoration: 'none',
        color: theme.palette.text.primary,
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
        width: '10000px',
        maxWidth: '100%',
        margin: '0 auto',
        padding: theme.spacing(1),
      },
    };
  })();
}
