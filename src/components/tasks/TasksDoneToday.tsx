import { Theme, Zoom } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import MobileStepper from '@material-ui/core/MobileStepper';
import Typography from '@material-ui/core/Typography';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import Skeleton from '@material-ui/lab/Skeleton';
import { makeStyles } from '@material-ui/styles';
import React from 'react';
import { IDayliStreak } from '../../entities/IDayliStreak';
import { useTypedTranslate } from '../../services/index';
import { NumbersAnimatedOnUpdate } from '../ui/NumbersAnimatedOnUpdate';
import DayliTasksStreak from './DayliTasksStreak';

const useStyles = makeStyles((theme: Theme) => ({
  progress: {
    padding: 0,
    width: '100%',
    height: '6px',
  },
  successIcon: {
    marginLeft: '5px',
    verticalAlign: 'bottom',
    color: theme.palette.primary.main,
  },
}));

export interface TasksDoneTodayProps {
  isLoaded?: boolean;
  tasksPerDay: number;
  tasksToday: number;
  dailyStreak: IDayliStreak;
  isUpdateAnimationDisabled?: boolean;
}

function TasksDoneToday({
  tasksToday,
  tasksPerDay,
  isUpdateAnimationDisabled,
  ...props
}: TasksDoneTodayProps) {
  const classes = useStyles();
  const t = useTypedTranslate();
  const isAchieved = tasksToday >= tasksPerDay;

  if (!props.isLoaded) {
    return <Skeleton variant="rect" height="160px" />;
  }
  return (
    <Card>
      <CardContent>
        <Box mb={2}>
          <Typography variant="h6" display="inline">
            {`${t('completed_tasks_today')}: `}
            <Box display="inline" fontWeight={isAchieved ? 900 : 600}>
              <NumbersAnimatedOnUpdate
                value={tasksToday}
                isAnimationDisabled={isUpdateAnimationDisabled}
              />
            </Box>
          </Typography>
          <Box display="inline" className={classes.successIcon}>
            {isAchieved && (
              <Zoom in>
                <CheckCircleOutlineIcon />
              </Zoom>
            )}
          </Box>
        </Box>
        <MobileStepper
          position="static"
          variant="progress"
          nextButton={<div />}
          backButton={<div />}
          steps={tasksPerDay + 1}
          classes={{
            progress: classes.progress,
          }}
          activeStep={
            tasksToday > tasksPerDay ? tasksPerDay : tasksToday
          }
        />
        <Box mt={2} />
        <DayliTasksStreak
          isUpdateAnimationDisabled
          streak={props.dailyStreak}
        />
      </CardContent>
    </Card>
  );
}

export default React.memo(TasksDoneToday);
