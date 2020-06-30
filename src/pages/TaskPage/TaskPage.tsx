import { Box, CardHeader } from '@material-ui/core';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Fab from '@material-ui/core/Fab';
import Grid, { GridProps } from '@material-ui/core/Grid';
import MuiLink from '@material-ui/core/Link';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Zoom from '@material-ui/core/Zoom';
import SatisfiedIcon from '@material-ui/icons/SentimentSatisfiedAlt';
import DissatisfiedIcon from '@material-ui/icons/SentimentVeryDissatisfied';
import Skeleton from '@material-ui/lab/Skeleton';
import filter from 'lodash/filter';
import isString from 'lodash/isString';
import { useSnackbar } from 'notistack';
import compose from 'ramda/es/compose';
import defaultTo from 'ramda/es/defaultTo';
import head from 'ramda/es/head';
import prop from 'ramda/es/prop';
import React, { useEffect } from 'react';
import { When } from 'react-if';
import { Link, Route, Switch, useRouteMatch } from 'react-router-dom';
import HardChoices from '../../components/tasks/HardChoices';
import TaskChoices from '../../components/tasks/TaskChoices/TaskChoices';
import TroublesChoices from '../../components/tasks/TroubledChoices';
import UpsertNote from '../../components/tasks/UpsertNote/UpsertNote';
import AppTour from '../../components/ui/AppTour';
import Collapsible from '../../components/ui/Collapsible';
import Timer from '../../components/ui/Timer';
import { useTypedTranslate } from '../../services/index';
import { Task } from '../../store';
import {
  deleteTaskArguments,
  updateTaskParams,
} from './TaskPageContainer';
import sample from 'lodash/sample';

// TODO i18n
const encouragingMessages = [
  'Не думай об этом. Просто начни действовать',
  'Ты хочешь это сделать или ты себя заставляешь? Это большая разница.',
];

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
}));

export const TaskPageGridWidth: GridProps = {
  xs: 12,
  sm: 8,
  md: 6,
};

interface TaskPageProps {
  task: Task;
  taskId: string;
  loading: boolean;
  isAppIntroMode: boolean;
  deleteTask: (options?: deleteTaskArguments) => Promise<void>;
  updateTask: (options: updateTaskParams) => Promise<void>;
}

export default function TaskPage(props: TaskPageProps) {
  const { enqueueSnackbar } = useSnackbar();
  const route = useRouteMatch() || {};
  const t = useTypedTranslate();
  const { path, url } = route;
  const classes = useStyles();
  const { loading, taskId, task } = props;
  const activeSubtasks = filter(task.subtasks, i => !i.isDone);
  const hasSubtasks = Boolean(activeSubtasks.length);

  // Show encouraging snackbar after short delay
  // NOTE: Make sure snackbar is not shown when user redirects.
  useEffect(() => {
    const snackBarTimeout = setTimeout(() => {
      enqueueSnackbar(sample(encouragingMessages), {
        autoHideDuration: 5000,
      });
    }, 2500);
    return () => clearTimeout(snackBarTimeout);
  }, [enqueueSnackbar]);

  if (loading) {
    return (
      <Grid
        container
        spacing={4}
        justify="center"
        alignItems="center"
        className={classes.pageContainer}
      >
        <Grid item {...TaskPageGridWidth}>
          <Box width="100%" height="400px">
            <Skeleton style={{ height: '100%' }} />
          </Box>
        </Grid>
      </Grid>
    );
  }

  return (
    <Grid
      container
      spacing={4}
      alignItems="center"
      alignContent="center"
      className={classes.pageContainer}
    >
      <When condition={props.isAppIntroMode}>
        <AppTour step={2} />
      </When>
      <Timer
        onEnd={() => {
          // TODO i18n
          enqueueSnackbar(
            'Вы достаточно поработали над задачей. Можете смело жать "сделал шаг вперед". Вы молодец.',
            {
              autoHideDuration: 10000,
            },
          );
        }}
        autoStart
      />
      <Grid item xs={12}>
        <Grid
          item
          style={{ margin: '0 auto' }}
          {...TaskPageGridWidth}
        >
          <Zoom in>
            <Card>
              <MuiLink component={Link} to={`/tasks/${taskId}`}>
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
                      head,
                    )(activeSubtasks)}
                  </Typography>
                </CardContent>
              </MuiLink>
            </Card>
          </Zoom>
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
            <Grid container item {...TaskPageGridWidth}>
              <When condition={Boolean(task.note)}>
                <Grid item xs={12}>
                  <Zoom in>
                    <Box mb={4}>
                      <Collapsible
                        isOpen={isString(task.note)}
                        title={t(task.note ? 'A note' : 'Add a note')}
                      >
                        <UpsertNote
                          taskId={taskId}
                          defaultValue={task.note}
                        />
                      </Collapsible>
                    </Box>
                  </Zoom>
                </Grid>
              </When>
              <Zoom in>
                <Box width="100%" textAlign="center">
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
