import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Zoom from '@material-ui/core/Zoom';
import filter from 'lodash/filter';
import get from 'lodash/get';
import isString from 'lodash/isString';
import PropTypes from 'prop-types';
import React from 'react';
import { When } from 'react-if';
import UpsertNote from '../../components/tasks/UpsertNote/UpsertNote';
import AppTour from '../../components/ui/AppTour';
import Collapsible from '../../components/ui/Collapsible';
import { Task } from '../../store';
import { Switch, Route, Link, useRouteMatch } from 'react-router-dom';
import HardChoices from '../../components/tasks/HardChoices';
import TroublesChoices from '../../components/tasks/TroubledChoices';
import TaskChoices from '../../components/tasks/TaskChoices/TaskChoices';
import Timer from '../../components/ui/Timer';
import { useFabStyles } from '../../components/ui/Fab';

const useStyles = makeStyles(theme => ({
  pageContainer: {
    minHeight: 'calc(100vh - 64px)',
  },
  loadingContainer: {
    position: 'absolute',
    left: 'calc(50% - 15px)',
    top: 'calc(50% - 56px)',
  },
  link: {
    textDecoration: 'none',
    color: theme.palette.text.primary,
  },
  choices: {
    marginTop: '20px',
  },
}));

interface TaskPageProps {
  task: Task;
  taskId: string;
  loading: boolean;
  isAppIntroMode: boolean;
  updateTask: Function;
  updateSubtask: Function;
  deleteTask: Function;
}

export default function TaskPage(props: TaskPageProps) {
  const path = get(useRouteMatch(), 'path');
  const classes = useStyles();
  const { fab: fabClassName } = useFabStyles();
  const { loading, taskId, task } = props;
  const activeSubtasks = filter(task.subtasks, i => !i.isDone);
  const hasSubtasks = Boolean(activeSubtasks.length);

  if (loading) {
    return (
      <Grid
        item
        component={CircularProgress}
        className={classes.loadingContainer}
      />
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
      <When condition={props.isAppIntroMode}>
        <AppTour step={2} />
      </When>
      <Grid item xs={12} sm={8} md={6} lg={5}>
        <Link className={classes.link} to={`/tasks/${taskId}`}>
          <Zoom in>
            <Card>
              <CardContent>
                <When condition={hasSubtasks}>
                  <Typography color="textSecondary" gutterBottom>
                    {task.name}
                  </Typography>
                </When>
                <Typography variant="h5" component="h1">
                  {get(activeSubtasks, '[0].name') || task.name}
                </Typography>
              </CardContent>
            </Card>
          </Zoom>
        </Link>
      </Grid>
      <Grid item xs={12}>
        <Grid
          item
          xs={12}
          sm={8}
          md={6}
          lg={5}
          style={{ margin: '0 auto' }}
        >
          <Collapsible isOpen={isString(task.note)}>
            <UpsertNote taskId={taskId} defaultValue={task.note} />
          </Collapsible>
        </Grid>
      </Grid>
      <Switch>
        <Route path={`${path}/isTroublesome/isHard`}>
          <HardChoices {...props} />
        </Route>
        <Route path={`${path}/isTroublesome`}>
          <TroublesChoices {...props} />
        </Route>
        <Route path={path}>
          {/*
          // @ts-ignore */}
          <TaskChoices {...props} />
        </Route>
      </Switch>
      <Timer className={fabClassName} />
    </Grid>
  );
}

TaskPage.propTypes = {
  loading: PropTypes.bool,
  task: PropTypes.object.isRequired,
  taskId: PropTypes.string.isRequired,
  isAppIntroMode: PropTypes.bool,
};
