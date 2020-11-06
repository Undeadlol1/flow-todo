import {
  IconButton,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  Theme,
} from '@material-ui/core';
import Tooltip from '@material-ui/core/Tooltip';
import BrokenImageIcon from '@material-ui/icons/BrokenImage';
import DeleteIcon from '@material-ui/icons/Delete';
import { makeStyles } from '@material-ui/styles';
import get from 'lodash/get';
import React, { memo, useState } from 'react';
import { When } from 'react-if';
import { Link } from 'react-router-dom';
import { Task } from '../../entities/Task';
import { useTypedTranslate } from '../../services/index';
import TaskService from '../../services/TaskService';

interface Props {
  task: Task;
  isStale?: boolean;
  canDelete?: boolean;
  deleteTask?: (id: string) => void;
}

const TasksListItem = memo(function TasksListItem({
  task,
  canDelete,
  deleteTask,
  ...props
}: Props) {
  const classes = useStyles();
  const t = useTypedTranslate();

  const [isTooltipVisible, setTooltipVisibility] = useState(false);

  function toggleTooltip(
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
  ) {
    event.preventDefault();
    event.stopPropagation();
    setTooltipVisibility(!isTooltipVisible);
  }

  const isStale = TaskService.isStale(task) || !!props.isStale;
  const text = get(task, 'subtasks[0].name', task.name);

  return (
    <ListItem
      button
      component={Link}
      className={classes.link}
      to={`/tasks/${task.id}${
        isStale ? '/isTroublesome/isHard' : ''
      }`}
    >
      <When condition={isStale}>
        <Tooltip title={t('task_is_stale')} onClick={toggleTooltip}>
          <ListItemIcon>
            <BrokenImageIcon />
          </ListItemIcon>
        </Tooltip>
      </When>
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

function useStyles() {
  return makeStyles((theme: Theme) => ({
    link: {
      textDecoration: 'none',
      color: theme.palette.text.primary,
    },
    text: {
      display: 'inline',
    },
    textWrapper: {
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      [theme.breakpoints.down('sm')]: {
        whiteSpace: 'nowrap',
        maxWidth: '100%',
      },
    },
  }))();
}

TasksListItem.displayName = 'TasksListItem';

export { TasksListItem };
