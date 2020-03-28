import MobileStepper from '@material-ui/core/MobileStepper';
import { makeStyles } from '@material-ui/core/styles';
import React from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import { useSelector } from 'react-redux';
import { taskLogsSelector as taskLogs } from '../../store/selectors';
import includes from 'ramda/es/includes';
import { useTypedTranslate } from '../../services/index';
import { isLoaded } from 'react-redux-firebase';
import countBy from 'lodash/countBy';

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
  const tasksToday =
    countBy(logs, log =>
      includes(log.actionType, [
        'stepForward',
        'leapForward',
        'setDone',
      ]),
    ).true || 0;

  if (isLoaded(logs))
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
  else return null;
};

export default React.memo(TasksDoneToday);
