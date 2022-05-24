import { Theme } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import List from '@material-ui/core/List';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import Pagination, {
  PaginationRenderItemParams,
} from '@material-ui/lab/Pagination';
import PaginationItem from '@material-ui/lab/PaginationItem';
import debug from 'debug';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import React, { useState } from 'react';
import { Else, If, Then, When } from 'react-if';
import { tasksPerPage } from '../../../constants';
import { Task } from '../../../entities/Task';
import { TasksListItem } from '../TasksListItem';

const log = debug('TasksList');

export function TasksList({
  isLoading,
  tasks = [],
  canDelete,
  deleteTask,
}: {
  tasks: Task[];
  isLoading: boolean;
  canDelete?: boolean;
  deleteTask?: (id: string) => void;
}) {
  const classes = useStyles();
  const [page, setPage] = useState(1);

  const sliceTasksTo = tasksPerPage * page;
  const sliceTasksFrom = tasksPerPage * (page - 1);
  const numberOfPAges = Math.ceil(tasks.length / tasksPerPage);
  const isListLoading =
    isLoading || isEmpty(tasks) || get(tasks, 'empty');

  log('tasks: %O', tasks);
  log('page: ', page);
  log('numberOfPAges: ', numberOfPAges);

  return (
    <Paper className={classes.paper}>
      <List className={classes.list}>
        <If condition={isListLoading}>
          <Then>
            <ListSkeleton />
          </Then>
          <Else>
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
          </Else>
        </If>
      </List>
      <TasksPagination
        tasks={tasks}
        setPage={setPage}
        numberOfPAges={numberOfPAges}
      />
    </Paper>
  );
}

function ListSkeleton() {
  return (
    <>
      {Array(tasksPerPage)
        .fill(undefined)
        .map((index) => (
          <TasksListItem
            key={index}
            isStale={false}
            task={{} as Task}
            isLoading={true}
          />
        ))}
    </>
  );
}

function TasksPagination(props: {
  tasks: Task[];
  numberOfPAges: number | undefined;
  setPage: (arg0: number) => void;
}) {
  return (
    <When condition={props.tasks.length > tasksPerPage}>
      <Box display="flex" justifyContent="center">
        <Pagination
          boundaryCount={1}
          count={props.numberOfPAges}
          renderItem={renderOnlyPaginationArrows}
          onChange={(_, pageNumber) => props.setPage(pageNumber)}
        />
      </Box>
    </When>
  );
}

function renderOnlyPaginationArrows(
  paginationItemParams: PaginationRenderItemParams,
): JSX.Element | null {
  if (
    paginationItemParams.type === 'previous' ||
    paginationItemParams.type === 'next'
  ) {
    return <PaginationItem {...paginationItemParams} />;
  }
  return null;
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
