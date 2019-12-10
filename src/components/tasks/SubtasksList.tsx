import React from 'react';
import { auth } from 'firebase/app';
import { useAuthState } from 'react-firebase-hooks/auth';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
// import ListItemIcon from '@material-ui/core/ListItemIcon';
// import Checkbox from '@material-ui/core/Checkbox';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import Paper from '@material-ui/core/Paper';
import isEmpty from 'lodash/isEmpty';
import { useTranslation } from 'react-i18next';
import reverse from 'lodash/reverse';
import { deleteSubtask, Subtask } from '../../store';
import { handleErrors } from '../../services/index';

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
    paper: {
      width: '100%',
      padding: theme.spacing(1),
    },
  };
});

interface Props {
  documents?: Subtask[];
}

export default function SubtasksList({ documents, ...props }: Props) {
  const [t] = useTranslation();
  const classes = useStyles();
  const [user, userIsLoading, userError] = useAuthState(auth());
  const isDisabled = !!(userIsLoading || userError || !user);

  handleErrors(userError);

  /* TODO: toggleDone must act as "setDone" in TaskChoices */
  // function toggleIsDone(subtask) {
  //   updateSubtask(subtask, {
  //     isDone: !subtask.isDone,
  //     doneAt: subtask.isDone ? null : Date.now(),
  //   })
  //   .catch(error => console.error(error));
  // }

  if (!documents || isEmpty(documents)) return null;

  return (
    <Paper elevation={6} className={classes.paper}>
      <List className={classes.list}>
        <ListSubheader>{`${t('subtasks')}:`}</ListSubheader>
        {reverse(documents).map(task => (
          <ListItem key={task.id} className={classes.link}>
            {/* <ListItemIcon>
              <Checkbox
                disableRipple
                edge="start"
                tabIndex={-1}
                checked={task.isDone}
                inputProps={{ 'aria-labelledby': `checkbox-list-label-${task.name}` }}
                onClick={() => toggleIsDone(task)}
              />
            </ListItemIcon> */}
            <ListItemText primary={task.name} />
            <ListItemSecondaryAction>
              <IconButton
                edge="end"
                aria-label="Delete"
                disabled={isDisabled}
                onClick={() => deleteSubtask(task.parentId, task)}
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
