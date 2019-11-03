import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import { firestore } from 'firebase/app';
import {
  useParams,
  Link,
  useRouteMatch,
  useHistory,
} from 'react-router-dom';
import { withSnackbar } from 'notistack';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import Zoom from '@material-ui/core/Zoom';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
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
}));


export function TaskPage(props) {
  const classes = useStyles();
  if (props.loading) {
    return (
      <Grid
        item
        align="center"
        className={classes.loadingContainer}
      >
        <CircularProgress />
      </Grid>
    );
  }

  return (
    <Grid
      container
      direction="row"
      justify="center"
      alignItems="center"
      alignContent="center"
      className={classes.pageContainer}
    >
      <Grid item xs md={6} lg={4} align="center">
        <Link className={classes.link} to={`/tasks/${props.taskId}`}>
          <Button variant="outlined">
            <Zoom in>
              <Typography className={classes.title} variant="h5">
                {props.task.name}
              </Typography>
            </Zoom>
          </Button>
        </Link>
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

export default withSnackbar(props => {
  const { taskId } = useParams();
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
    postponeTask() {
      setRequested(true);
      return taskPointer
        .update({ dueAt: Date.now() + 1000 * 60 * 60 * 24 })
        .then(() => {
          props.enqueueSnackbar('Отложено до завтра');
          history.push('/');
        })
        .catch(e => console.error(e));
    },
    task: task || {},
    loading: loading || isRequested,
    taskId,
    path,
    ...props,
  };
  return <TaskPage {...mergedProps} />;
});
