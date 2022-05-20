import { Theme } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import List from '@material-ui/core/List';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import Pagination from '@material-ui/lab/Pagination';
import debug from 'debug';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import React, { useState } from 'react';
import { When } from 'react-if';
import { tasksPerPage } from '../../../constants';
import { Task } from '../../../entities/Task';
import { TasksListItem } from '../TasksListItem';

const log = debug('TasksList');

interface TasksListProps {
  tasks: Task[];
  loading: boolean;
  canDelete?: boolean;
  deleteTask?: (id: string) => void;
}

export function TasksList({
  loading,
  tasks = [],
  canDelete,
  deleteTask,
}: TasksListProps) {
  const classes = useStyles();
  const [page, setPage] = useState(1);

  const sliceTasksTo = tasksPerPage * page;
  const sliceTasksFrom = tasksPerPage * (page - 1);
  const numberOfPAges = Math.ceil(tasks.length / tasksPerPage);

  log('tasks: %O', tasks);
  log('page: ', page);
  log('numberOfPAges: ', numberOfPAges);

  if (loading || isEmpty(tasks) || get(tasks, 'empty')) {
    return null;
  }
  return (
    <Paper className={classes.paper}>
      <List className={classes.list}>
        {tasks.slice(sliceTasksFrom, sliceTasksTo).map((task) => {
          return (
            <TasksListItem
              key={task.id}
              task={task}
              canDelete={canDelete}
              deleteTask={deleteTask}
            />
          );
        })}
      </List>
      <When condition={tasks.length > tasksPerPage}>
        <Box display="flex" justifyContent="center">
          <Pagination
            boundaryCount={1}
            count={numberOfPAges}
            onChange={(e, pageNumber) => setPage(pageNumber)}
          />
        </Box>
      </When>
    </Paper>
  );
}

function useStyles() {
  return makeStyles((theme: Theme) => {
    return {
      list: {
        width: '100%',
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
