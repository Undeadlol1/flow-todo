import { Box, CardHeader } from '@material-ui/core';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CircularProgress from '@material-ui/core/CircularProgress';
import Fab from '@material-ui/core/Fab';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Zoom from '@material-ui/core/Zoom';
import SatisfiedIcon from '@material-ui/icons/SentimentSatisfiedAlt';
import DissatisfiedIcon from '@material-ui/icons/SentimentVeryDissatisfied';
import filter from 'lodash/filter';
import isString from 'lodash/isString';
import compose from 'ramda/es/compose';
import defaultTo from 'ramda/es/defaultTo';
import last from 'ramda/es/last';
import prop from 'ramda/es/prop';
import React from 'react';
import { When } from 'react-if';
import { Link, Route, Switch, useRouteMatch } from 'react-router-dom';
import CreateTaskFab from '../../components/tasks/CreateTaskFab';
import HardChoices from '../../components/tasks/HardChoices';
import TaskChoices from '../../components/tasks/TaskChoices/TaskChoices';
import TroublesChoices from '../../components/tasks/TroubledChoices';
import UpsertNote from '../../components/tasks/UpsertNote/UpsertNote';
import AppTour from '../../components/ui/AppTour';
import Collapsible from '../../components/ui/Collapsible';
import { useTypedTranslate } from '../../services/index';
import { Task } from '../../store';
import {
  deleteTaskArguments,
  updateTaskParams,
} from './TaskPageContainer';

const useStyles = makeStyles(theme => ({
  pageContainer: {
    marginTop: 0,
    marginBottom: 0,
    overflow: 'hidden',
    minHeight: 'calc(100vh - 74px)',
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
  updateSubtask: Function;
  deleteTask: (options?: deleteTaskArguments) => Promise<void>;
  updateTask: (options: updateTaskParams) => Promise<void>;
}

export default function TaskPage(props: TaskPageProps) {
  const route = useRouteMatch() || {};
  const t = useTypedTranslate();
  const { path, url } = route;
  const classes = useStyles();
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
      <CreateTaskFab />
      <Grid item xs={12}>
        <Grid
          style={{ margin: '0 auto' }}
          item
          xs={12}
          sm={8}
          md={6}
          lg={5}
        >
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
                    {compose(
                      defaultTo(task.name),
                      prop('name'),
                      last,
                    )(activeSubtasks)}
                  </Typography>
                </CardContent>
              </Card>
            </Zoom>
          </Link>
        </Grid>
      </Grid>
      <Grid container justify="center" item xs={12}>
        <Switch>
          <Route path={`${path}/isTroublesome/isHard`}>
            <HardChoices {...props} />
          </Route>
          <Route path={`${path}/isTroublesome`}>
            <TroublesChoices {...props} />
          </Route>
          <Route path={path + '/isGood'}>
            <TaskChoices
              className="IntroHandle__choices"
              {...props}
            />
          </Route>
          <Route path={path}>
            <Grid container item xs={12} sm={8} md={6} lg={5}>
              <When condition={Boolean(task.note)}>
                <Grid item xs={12}>
                  <Zoom in>
                    <Grid
                      item
                      xs={12}
                      sm={8}
                      md={6}
                      lg={5}
                      style={{ margin: '0 auto' }}
                    >
                      <Collapsible
                        isOpen={isString(task.note)}
                        title={t(task.note ? 'A note' : 'Add a note')}
                      >
                        <UpsertNote
                          taskId={taskId}
                          defaultValue={task.note}
                        />
                      </Collapsible>
                    </Grid>
                  </Zoom>
                </Grid>
              </When>
              <Zoom in>
                <Box width="100%" textAlign="center" mt={4}>
                  <Card className="animated pulse infinite">
                    <CardHeader subheader={t('what do you feel')} />
                    <CardContent>
                      <Grid item container xs={12}>
                        <Grid item xs>
                          <Fab
                            component={Link}
                            color="secondary"
                            to={url + '/isGood'}
                          >
                            <SatisfiedIcon fontSize="large" />
                          </Fab>
                        </Grid>
                        <Grid item xs>
                          <Fab
                            component={Link}
                            color="primary"
                            to={url + '/isTroublesome'}
                          >
                            <DissatisfiedIcon fontSize="large" />
                          </Fab>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Box>
              </Zoom>
            </Grid>
          </Route>
        </Switch>
      </Grid>
    </Grid>
  );
}
