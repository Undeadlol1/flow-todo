import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import MobileStepper from '@material-ui/core/MobileStepper';
import Typography from '@material-ui/core/Typography';
import Skeleton from '@material-ui/lab/Skeleton';
import { makeStyles, withStyles } from '@material-ui/styles';
import React from 'react';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import { Theme, Zoom } from '@material-ui/core';
import classNames from 'classnames';
import { useTypedTranslate } from '../../services/index';
import DayliTasksStreak from './DayliTasksStreak';
import { IDayliStreak } from '../../store/index';
import { NumbersAnimatedOnUpdate } from '../unsorted/NumbersAnimatedOnUpdate';

const useStyles = makeStyles((theme: Theme) => ({
  successIcon: {
    marginLeft: '5px',
    verticalAlign: 'bottom',
    color: theme.palette.primary.main,
  },
  boldText: {
    fontWeight: 900,
  },
}));

const StyledMobileStepper = withStyles({
  progress: {
    padding: 0,
    width: '100%',
    height: '6px',
  },
})(MobileStepper);

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
  const completedTasksInpercentages = Number(
    (100 * (tasksToday / tasksPerDay)).toFixed(),
  );

  if (!props.isLoaded)
    return <Skeleton variant="rect" height="160px" />;
  return (
    <Card>
      <CardContent>
        <Box mb={2}>
          <Typography variant="h6" display="inline">
            {`${t('completed_tasks_today')}: `}
            <span
              className={classNames({
                [classes.boldText]: completedTasksInpercentages > 100,
              })}
            >
              <NumbersAnimatedOnUpdate
                value={completedTasksInpercentages}
                isAnimationDisabled={isUpdateAnimationDisabled}
              />
              {`${completedTasksInpercentages > 0 ? '%' : ''}`}
            </span>
          </Typography>
          <Box display="inline" className={classes.successIcon}>
            {isAchieved && (
              <Zoom in>
                <CheckCircleOutlineIcon />
              </Zoom>
            )}
          </Box>
        </Box>
        <StyledMobileStepper
          position="static"
          variant="progress"
          nextButton={<div />}
          backButton={<div />}
          steps={tasksPerDay + 1}
          activeStep={
            tasksToday > tasksPerDay ? tasksPerDay : tasksToday
          }
        />
        <Box mt={2}>
          <DayliTasksStreak
            streak={props.dailyStreak}
            isUpdateAnimationDisabled={isUpdateAnimationDisabled}
          />
        </Box>
      </CardContent>
    </Card>
  );
}

export default React.memo(TasksDoneToday);
