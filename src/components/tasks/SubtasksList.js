import React from 'react';
import PropTypes from 'prop-types';
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
import { deleteSubtask } from '../../store';

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

export function SubtasksList({ documents, ...props }) {
  const [t] = useTranslation();
  const classes = useStyles();
  const isDisabled =    props.userIsLoading || props.userError || !props.user;

  /* TODO: toggleDone must act as "setDone" in TaskChoices */
  // function toggleIsDone(subtask) {
  //   updateSubtask(subtask, {
  //     isDone: !subtask.isDone,
  //     doneAt: subtask.isDone ? null : Date.now(),
  //   })
  //   .catch(error => console.error(error));
  // }

  if (isEmpty(documents)) return null;

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
                onClick={() => props.deleteSubtask(task.parentId, task)}
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

SubtasksList.propTypes = {
  user: PropTypes.object,
  documents: PropTypes.array,
  userError: PropTypes.oneOfType([
    PropTypes.bool.isRequired,
    PropTypes.object.isRequired,
  ]),
  userIsLoading: PropTypes.bool,
  deleteSubtask: PropTypes.func.isRequired,
};

export default function SubtasksListContainer(props) {
  const [user, userError, userIsLoading] = useAuthState(auth());

  if (userError) console.error(userError);

  const mergeProps = {
    ...props,
    user,
    userError,
    userIsLoading,
    deleteSubtask,
  };

  return <SubtasksList {...mergeProps} />;
}
