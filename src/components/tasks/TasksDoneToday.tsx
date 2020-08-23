import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import MobileStepper from '@material-ui/core/MobileStepper';
import Typography from '@material-ui/core/Typography';
import Skeleton from '@material-ui/lab/Skeleton';
import { makeStyles, withStyles } from '@material-ui/styles';
import React from 'react';
import { useTypedTranslate } from '../../services/index';
import DayliTasksStreak from './DayliTasksStreak';
import { IDayliStreak } from '../../store/index';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import { Theme, Zoom } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) => ({
  successIcon: {
    marginLeft: '5px',
    verticalAlign: 'bottom',
    color: theme.palette.primary.main,
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
}

const TasksDoneToday: React.FC<TasksDoneTodayProps> = ({
  tasksToday,
  tasksPerDay,
  ...props
}) => {
  const classes = useStyles();
  const t = useTypedTranslate();
  // TODO rename
  const isAchieved = tasksToday >= tasksPerDay;

  if (!props.isLoaded)
    return <Skeleton variant="rect" height="160px" />;
  else
    return (
      <>
        <Card>
          <CardContent>
            <Box mb={2}>
              <Typography variant="h6" display="inline">
                {t('completed_tasks_today') +
                  `: ${tasksToday}/${tasksPerDay}`}
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
              steps={tasksPerDay + 1}
              variant="progress"
              position="static"
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
