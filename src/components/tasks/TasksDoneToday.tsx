import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import MobileStepper from '@material-ui/core/MobileStepper';
import Typography from '@material-ui/core/Typography';
import Skeleton from '@material-ui/lab/Skeleton';
import { makeStyles } from '@material-ui/styles';
import React from 'react';
import DailyStreak from '../../services/dailyStreak';
import { useTypedTranslate } from '../../services/index';
import DayliTasksStreak from './DayliTasksStreak';

const useStyles = makeStyles({
  progress: {
    padding: 0,
    width: '100%',
  },
});

export interface TasksDoneTodayProps {
  isLoaded?: boolean;
  tasksPerDay: number;
  tasksToday: number;
  dailyStreak: DailyStreak;
}

const TasksDoneToday: React.FC<TasksDoneTodayProps> = ({
  tasksToday,
  tasksPerDay,
  ...props
}) => {
  const classes = useStyles();
  const t = useTypedTranslate();

  if (!props.isLoaded)
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
            <Box mt={2}>
              <DayliTasksStreak streak={props.dailyStreak} />
            </Box>
          </CardContent>
        </Card>
      </>
    );
};

export default React.memo(TasksDoneToday);
