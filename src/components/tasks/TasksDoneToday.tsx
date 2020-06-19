import MobileStepper from '@material-ui/core/MobileStepper';
import { makeStyles } from '@material-ui/core/styles';
import React from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import { useSelector } from 'react-redux';
import {
  taskLogsSelector as taskLogs,
  tasksDoneTodaySelector,
} from '../../store/selectors';
import { useTypedTranslate } from '../../services/index';
import { isLoaded } from 'react-redux-firebase';
import Skeleton from '@material-ui/lab/Skeleton';
import Box from '@material-ui/core/Box';

const useStyles = makeStyles({
  progress: {
    width: '100%',
  },
});

const TasksDoneToday: React.FC<{}> = () => {
  const classes = useStyles();
  const t = useTypedTranslate();

  const tasksPerDay = 3;
  const logs = useSelector(taskLogs);
  const tasksToday = useSelector(tasksDoneTodaySelector);
  console.log('tasksToday: ', tasksToday);

  if (!isLoaded(logs))
    return <Skeleton component={Box} width="100%" height="200px" />;
  else
    return (
      <>
        <Card>
          <CardHeader
            title={
              t('completed_tasks_today') +
              `: ${tasksToday}/${tasksPerDay}`
            }
          />
          <CardContent>
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
          </CardContent>
        </Card>
      </>
    );
};

export default React.memo(TasksDoneToday);
