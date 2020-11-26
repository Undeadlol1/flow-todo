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

  const isStale = TaskService.isStale(task) || !!props.isStale;
  const [isTooltipVisible, setTooltipVisibility] = useState(false);
  const text =
    TaskService.getFirstActiveSubtask(task)?.name || task.name;

  function toggleTooltip(
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
  ) {
    event.preventDefault();
    event.stopPropagation();
    setTooltipVisibility(!isTooltipVisible);
  }

  return (
    <ListItem
      button
      component={Link}
      className={classes.link}
      to={`/tasks/${task.id}${isStale ? '/isHard' : ''}`}
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
      <DeleteButton
        isVisible={canDelete}
        onClick={() => deleteTask && deleteTask(task.id)}
      />
    </ListItem>
  );
});

function DeleteButton({
  onClick,
  isVisible,
}: {
  onClick: () => void;
  isVisible: Props['canDelete'];
}) {
  return (
    <When condition={!!isVisible}>
      <ListItemSecondaryAction>
        <IconButton edge="end" aria-label="Delete" onClick={onClick}>
          <DeleteIcon />
        </IconButton>
      </ListItemSecondaryAction>
    </When>
  );
}

function useStyles() {
  return makeStyles((theme: Theme) => ({
    text: {
      display: 'inline',
    },
    link: {
      textDecoration: 'none',
      color: theme.palette.text.primary,
    },
    textWrapper: {
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      [theme.breakpoints.down('sm')]: {
        maxWidth: '100%',
        whiteSpace: 'nowrap',
      },
    },
  }))();
}

export { TasksListItem };
