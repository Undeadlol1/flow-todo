import { Box, Theme } from '@material-ui/core';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Grid, { GridProps } from '@material-ui/core/Grid';
import MuiLink from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
import Zoom from '@material-ui/core/Zoom';
import Skeleton from '@material-ui/lab/Skeleton';
import { makeStyles } from '@material-ui/styles';
import filter from 'lodash/filter';
import isString from 'lodash/isString';
import sample from 'lodash/sample';
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
import Collapsible from '../../components/ui/Collapsible';
import Timer from '../../components/ui/Timer';
import { WhatDoYouFeelAboutTheTask } from '../../components/unsorted/WhatDoYouFeelAboutTheTask';
import { useTypedTranslate } from '../../services/index';
import { Task } from '../../store';
import {
  deleteTaskArguments,
  updateTaskParams,
} from './TaskPageContainer';
import {
  TasksDoneTodayNotification,
  TasksDoneTodayNotificationProps,
} from '../../components/unsorted/TasksDoneTodayNotification';
import isEmpty from 'lodash/isEmpty';

// TODO i18n
const encouragingMessages = [
  'Не думай об этом. Просто начни действовать',
  'Ты хочешь это сделать или ты себя заставляешь? Это большая разница.',
  'Прокрастинация - это боязнь действия. Чем больше думаешь, тем труднее начать действовать.',
];

const useStyles = makeStyles((theme: Theme) => ({
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

export interface TaskPageProps {
  task: Task;
  taskId: string;
  loading: boolean;
  shouldDisplayEncouragements: boolean;
  // TODO this feels wrong.
  tasksDoneTodayNotificationProps: TasksDoneTodayNotificationProps;
  deleteTask: (options?: deleteTaskArguments) => Promise<void>;
  updateTask: (options: updateTaskParams) => Promise<void>;
}

export default function TaskPage(props: TaskPageProps) {
  const classes = useStyles();
  const t = useTypedTranslate();
  const route = useRouteMatch() || {};
  const { enqueueSnackbar } = useSnackbar();

  const { path } = route;
  const {
    task,
    taskId,
    loading,
    tasksDoneTodayNotificationProps,
  } = props;
  const activeSubtasks = filter(task.subtasks, i => !i.isDone);

  // Show encouraging snackbar after short delay
  // NOTE: Make sure snackbar is not shown when user redirects.
  useEffect(() => {
    const snackBarTimeout = setTimeout(() => {
      if (!props.shouldDisplayEncouragements) return;
      if (tasksDoneTodayNotificationProps.isVisible) return;
      enqueueSnackbar(sample(encouragingMessages), {
        autoHideDuration: 4500,
      });
    }, 3500);
    return () => clearTimeout(snackBarTimeout);
    // eslint-disable-next-line
  }, [enqueueSnackbar, props.shouldDisplayEncouragements]);

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
      <TasksDoneTodayNotification
        {...tasksDoneTodayNotificationProps}
      />
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
                  <When condition={!isEmpty(activeSubtasks)}>
                    <Typography color="textSecondary" gutterBottom>
                      {task.name}
                    </Typography>
                  </When>
                  <Typography variant="h5" component="h1">
                    {/* TODO rework this */}
                    {/* @ts-ignore */}
                    {compose(
                      defaultTo(task.name),
                      // @ts-ignore
                      prop('name'),
                      head,
                      // @ts-ignore
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
                <WhatDoYouFeelAboutTheTask />
              </Zoom>
            </Grid>
          </Route>
        </Switch>
      </Grid>
    </Grid>
  );
}
