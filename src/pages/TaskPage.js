import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import { firestore } from 'firebase/app';
import {
  useParams,
  Link,
  useRouteMatch,
  useHistory,
} from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import Zoom from '@material-ui/core/Zoom';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import { addDays } from 'date-fns/esm';
import { useTranslation } from 'react-i18next';
import get from 'lodash/get';
import UpsertNote from 'components/tasks/UpsertNote/UpsertNote';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Collapse from '@material-ui/core/Collapse';
import clsx from 'clsx';
import CardActions from '@material-ui/core/CardActions';
import IconButton from '@material-ui/core/IconButton';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import TaskChoices from '../components/tasks/TaskChoices/TaskChoices';

const useStyles = makeStyles(theme => ({
  pageContainer: {
    minHeight: 'calc(100vh - 64px)',
  },
  loadingContainer: {
    position: 'absolute',
    left: 'calc(50% - 15px)',
    top: 'calc(50% - 56px)',
  },
  title: {
    marginTop: '20px',
    marginBottom: '20px',
  },
  link: {
    color: theme.palette.text.primary,
    textDecoration: 'none',
  },
  doneButton: {
    marginTop: '30px',
  },
  choices: {
    marginTop: '20px',
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
}));

export function TaskPage(props) {
  const [t] = useTranslation();
  const classes = useStyles();
  const { loading, taskId, task } = props;
  const [expanded, setExpanded] = useState(false);
  function toggleExpanded(event) {
    event.stopPropagation();
    setExpanded(!expanded);
  }

  if (loading) {
    return (
      <Grid item align="center" className={classes.loadingContainer}>
        <CircularProgress />
      </Grid>
    );
  }

  return (
    <Grid
      container
      spacing={4}
      direction="row"
      justify="center"
      alignItems="center"
      alignContent="center"
      className={classes.pageContainer}
    >
      <Grid item xs={12} sm={8} md={4} lg={3} align="center">
        <Link className={classes.link} to={`/tasks/${taskId}`}>
          <Button variant="outlined">
            <Zoom in>
              <Typography className={classes.title} variant="h5">
                {task.name}
              </Typography>
            </Zoom>
          </Button>
        </Link>
      </Grid>
      <Grid item xs={12} align="center">
        <Grid item xs={12} sm={8} md={6} lg={5}>
          <Card>
            <CardActions disableSpacing onClick={toggleExpanded}>
              <Typography>{t('A note')}</Typography>
              <IconButton
                className={clsx(classes.expand, {
                [classes.expandOpen]: expanded,
              })}
                aria-expanded={expanded}
                // TODO: add i18n
                aria-label="show more"
                onClick={toggleExpanded}
              >
                <ExpandMoreIcon />
              </IconButton>
            </CardActions>
            <Collapse unmountOnExit in={expanded} timeout="auto">
              <CardContent>
                <UpsertNote taskId={taskId} defaultValue={task.note} />
              </CardContent>
            </Collapse>
          </Card>
        </Grid>
      </Grid>
      <TaskChoices className={classes.choices} {...props} />
    </Grid>
  );
}

TaskPage.propTypes = {
  loading: PropTypes.bool,
  task: PropTypes.object.isRequired,
  path: PropTypes.string.isRequired,
  taskId: PropTypes.string.isRequired,
  setDone: PropTypes.func.isRequired,
};

export default props => {
  const { enqueueSnackbar } = useSnackbar();

  const { taskId } = useParams();
  const [t] = useTranslation();
  const [isRequested, setRequested] = React.useState();
  const taskPointer = firestore()
    .collection('tasks')
    .doc(taskId);
  const [task, loading] = useDocumentData(taskPointer);
  const { path } = useRouteMatch();
  const history = useHistory();
  const mergedProps = {
    setDone() {
      setRequested(true);
      return taskPointer
        .update({ isDone: true, doneAt: Date.now() })
        .then(() => history.push('/'))
        .catch(e => console.error(e));
    },
    postponeTask(days = 1, message, variant = 'success') {
      setRequested(true);
      return taskPointer
        .update({ dueAt: addDays(new Date(), days).getTime() })
        .then(() => {
          if (message) enqueueSnackbar(message, { variant });
          history.push('/');
        })
        .catch(e => enqueueSnackbar(
            get(e, 'message') || t('Something went wrong'),
            { variant: 'error' },
          ));
    },
    task: task || {},
    loading: loading || isRequested,
    taskId,
    path,
    ...props,
  };
  return <TaskPage {...mergedProps} />;
};
