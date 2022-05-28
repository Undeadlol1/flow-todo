import { Theme, Typography } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Grid, { GridProps } from '@material-ui/core/Grid';
import Skeleton from '@material-ui/lab/Skeleton';
import { makeStyles } from '@material-ui/styles';
import clsx from 'clsx';
import debug from 'debug';
import React, { memo, ReactElement } from 'react';
import { Else, If, Then, When } from 'react-if';
import { isLoaded } from 'react-redux-firebase';
import CreateTaskFab from '../../components/tasks/CreateTaskFab';
import { TagsList } from '../../components/tasks/TagsList';
import TasksDoneToday from '../../components/tasks/TasksDoneToday';
import { TasksList } from '../../components/tasks/TasksList';
import WelcomeCard from '../../components/ui/WelcomeCard';
import { DailyStreak } from '../../entities/DailyStreak';
import { Task } from '../../entities/Task';
import { TaskHistory } from '../../entities/TaskHistory';
import { useIsScreenNarrow } from '../../hooks/useIsScreenNarrow';

const log = debug('IndexPage');

export interface IndexPageProps {
  tasksToday: number;
  logs: TaskHistory[];
  tasksPerDay: number;
  isLoading?: boolean;
  streak: DailyStreak;
  activeTasks?: Task[];
  createdAtleastOneTask: boolean;
}

export const IndexPage = memo(function IndexPage({
  isLoading,
  activeTasks = [],
  createdAtleastOneTask: hasCreatedAtleastOneTask,
  ...props
}: IndexPageProps) {
  const isScreeenNarrow = useIsScreenNarrow();

  log('isLoading: ', isLoading);
  log('activeTasks: %O', activeTasks);
  log('createdAtleastOneTask: ', hasCreatedAtleastOneTask);

  if (isLoading) {
    return (
      <RootWrapper>
        <Section>
          <Skeleton
            height="200px"
            variant="rect"
            animation="wave"
            width={isScreeenNarrow ? '320px' : '400px'}
          />
        </Section>
      </RootWrapper>
    );
  }

  return (
    <RootWrapper>
      <>
        <When condition={hasCreatedAtleastOneTask}>
          <Section isFullWidth={true}>
            <TasksDoneToday
              dailyStreak={props.streak}
              tasksToday={props.tasksToday}
              tasksPerDay={props.tasksPerDay}
              isLoaded={isLoaded(props.logs)}
              isUpdateAnimationDisabled={true}
            />
          </Section>
        </When>
        <If condition={props.tasksPerDay > props.tasksToday}>
          <Then>
            <Section isFullWidth={isScreeenNarrow}>
              <If condition={hasCreatedAtleastOneTask}>
                <Then>
                  <>
                    <TasksList
                      tasks={activeTasks}
                      isLoading={false}
                    />
                    <Box mt={2}>
                      <TagsList />
                    </Box>
                  </>
                </Then>
                <Else>
                  <WelcomeCard />
                </Else>
              </If>
            </Section>
          </Then>
          <Else>
            <Section>
              <Card>
                <CardContent>
                  <Typography paragraph>You did well!</Typography>
                  <Typography>Come back tomorrow</Typography>
                </CardContent>
              </Card>
            </Section>
          </Else>
        </If>
        <CreateTaskFab isHidden={isLoading} />
      </>
    </RootWrapper>
  );
});

const useStyles = makeStyles((theme: Theme) => ({
  fullWidth: {
    width: '100%',
  },
  pageContainer: {
    marginTop: 0,
    marginBottom: 0,
    minHeight: 'calc(100vh - 74px)',
  },
}));

function RootWrapper(props: { children: ReactElement }) {
  const classes = useStyles();
  const rootWrapperProps: GridProps = {
    spacing: 2,
    container: true,
    justify: 'center',
    direction: 'column',
    alignItems: 'stretch',
    alignContent: 'center',
    className: classes.pageContainer,
  };

  return <Grid {...rootWrapperProps}>{props.children}</Grid>;
}

function Section({
  isFullWidth = true,
  ...props
}: {
  children: ReactElement;
  isFullWidth?: boolean;
}) {
  const classes = useStyles();
  const sectionProps: GridProps = {
    sm: 8,
    md: 8,
    lg: 6,
    xs: 12,
    item: true,
    className: clsx(isFullWidth && classes.fullWidth),
  };

  return <Grid {...sectionProps}>{props.children}</Grid>;
}
