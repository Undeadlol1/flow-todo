import MobileStepper from '@material-ui/core/MobileStepper';
import { makeStyles } from '@material-ui/core/styles';
import React from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import { useSelector } from 'react-redux';
import { taskLogsSelector as taskLogs } from '../../store/selectors';
import includes from 'ramda/es/includes';
import compose from 'lodash/fp/compose';
import size from 'lodash/fp/size';
import filter from 'lodash/fp/filter';
import { useTypedTranslate } from '../../services/index';

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
  const tasksToday = compose(
    size,
    // @ts-ignore
    filter(({ actionType }) =>
      includes(actionType, ['stepForward', 'leapForward', 'setDone']),
    ),
  )(logs);

  if (typeof logs === 'undefined' || null) return null;
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
