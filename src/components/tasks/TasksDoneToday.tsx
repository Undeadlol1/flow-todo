import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import MobileStepper from '@material-ui/core/MobileStepper';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Skeleton from '@material-ui/lab/Skeleton';
import React from 'react';
import { isLoaded } from 'react-redux-firebase';
import { useTypedTranslate } from '../../services/index';
import { useTypedSelector } from '../../store';
import {
  taskLogsSelector as taskLogs,
  tasksDoneTodaySelector,
  tasksPerDaySelector,
} from '../../store/selectors';
import DayliTasksStreak from './DayliTasksStreak';

const useStyles = makeStyles({
  progress: {
    padding: 0,
    width: '100%',
  },
});

const TasksDoneToday: React.FC<{}> = () => {
  const classes = useStyles();
  const t = useTypedTranslate();

  const logs = useTypedSelector(taskLogs);
  const tasksToday = useTypedSelector(tasksDoneTodaySelector);
  const tasksPerDay = useTypedSelector(tasksPerDaySelector);

  if (!isLoaded(logs))
    return <Skeleton component={Box} width="100%" height="200px" />;
  else
    return (
      <>
        <Card>
          <CardContent>
            <Box mb={2}>
              <Typography variant="h6">
                {t('completed_tasks_today') +
                  `: ${tasksToday}/${tasksPerDay}`}
              </Typography>
            </Box>
            <MobileStepper
              steps={tasksPerDay + 1}
              variant="progress"
              position="static"
              classes={classes}
              activeStep={
                tasksToday > tasksPerDay ? tasksPerDay : tasksToday
              }
              nextButton={<div />}
              backButton={<div />}
            />
            <DayliTasksStreak mt={2} />
          </CardContent>
        </Card>
      </>
    );
};

export default React.memo(TasksDoneToday);
