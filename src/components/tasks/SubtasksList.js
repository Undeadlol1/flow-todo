import React from 'react';
import PropTypes from 'prop-types';
import { auth } from 'firebase/app';
import { useAuthState } from 'react-firebase-hooks/auth';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import isEmpty from 'lodash/isEmpty';
import { useTranslation } from 'react-i18next';
import { deleteSubtask } from '../../store';

const useStyles = makeStyles(theme => {
  const color = theme.palette.text.primary;
  return {
    title: {
      color,
      display: 'block',
      textAlign: 'left',
      margin: '0 10px',
    },
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

export function SubtasksList({
 userIsLoading, userError, documents, user, taskId,
}) {
  const [t] = useTranslation();
  const classes = useStyles();
  const isDisabled = userIsLoading || userError || !user;
  if (isEmpty(documents)) return null;
  return (
    <Paper elevation={6} className={classes.paper}>
      <Typography className={classes.title} variant="subtitle1">
        {`${t('subtasks')}:`}
      </Typography>
      {/* TODO: checkboxes */}
      {/* https://material-ui.com/components/lists/#checkbox */}
      <List className={classes.list}>
        {documents.map(task => (
          <ListItem
            key={task.id}
            className={classes.link}
          >
            <ListItemText primary={task.name} />
            <ListItemSecondaryAction>
              <IconButton
                edge="end"
                aria-label="Delete"
                disabled={isDisabled}
                onClick={() => deleteSubtask(taskId, task)}
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
  taskId: PropTypes.string.isRequired,
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
