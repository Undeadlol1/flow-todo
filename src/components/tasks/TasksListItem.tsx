import React, { memo } from 'react';
import {
  Box,
  IconButton,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  Theme,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { Task } from '../../entities/Task';
import TaskService from '../../services/TaskService';
import get from 'lodash/get';
import { Link } from 'react-router-dom';
import DeleteIcon from '@material-ui/icons/Delete';
import { When } from 'react-if';

const useStyles = makeStyles((theme: Theme) => ({
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
}));

interface Props {
  task: Task;
  canDelete?: boolean;
  deleteTask?: (id: string) => void;
}

const TasksListItem = memo(function TasksListItem({
  task,
  canDelete,
  deleteTask,
}: Props) {
  const classes = useStyles();

  const isStale = TaskService.isStale(task);
  console.log('isStale: ', isStale);
  const text = get(task, 'subtasks[0].name', task.name);
  return (
    <ListItem
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
});

function DeleteButton({
  isVisible: canDelete,
  onClick,
}: {
  onClick: () => void;
  isVisible: Props['canDelete'];
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

TasksListItem.displayName = 'TasksListItem';

export { TasksListItem };
