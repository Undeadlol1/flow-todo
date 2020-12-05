import { Box, Theme } from '@material-ui/core';
import LinearProgress from '@material-ui/core/LinearProgress';
import Tooltip from '@material-ui/core/Tooltip';
import { makeStyles } from '@material-ui/styles';
import cx from 'clsx';
import debug from 'debug';
import get from 'lodash/get';
import isUndefined from 'lodash/isUndefined';
import React, { memo } from 'react';
import { Profile } from '../../../entities/Profile';
import LevelingService from '../../../services/Leveling';

const log = debug('ExpirienceProgressBar');
const useStyles = makeStyles((theme: Theme) => ({
  hidden: {
    opacity: 0,
  },
  progress: {
    left: 0,
    bottom: 0,
    height: 10,
    width: '100%',
    position: 'fixed',
  },
  animatedNumbers: {
    bottom: 0,
    height: 10,
    left: '50%',
    width: '100%',
    position: 'fixed',
  },
}));

export const ExpirienceProgressBar: React.FC<{
  profile?: Profile;
  isAnimationActive: boolean;
}> = memo(({ isAnimationActive, ...props }) => {
  const classes = useStyles();
  const userPoints = get(props.profile, 'experience', 0);
  const level = LevelingService.calculateUserLevel(userPoints);

  const pointsToReachPreviousLevel = LevelingService.calculateTotalPointsToReachALevel(
    level,
  );
  const pointsToReachNextLevel = LevelingService.calculateTotalPointsToReachALevel(
    level + 1,
  );
  const differenceBetweenLevels =
    pointsToReachNextLevel - pointsToReachPreviousLevel;
  const userProgressInPoints =
    userPoints - pointsToReachPreviousLevel;
  const progressPercent =
    (userProgressInPoints * 100) / differenceBetweenLevels;

  log('level', level);
  log('userPoints', userPoints);
  log('progressPercent: ', progressPercent);
  log(
    'points to next level',
    pointsToReachPreviousLevel +
      LevelingService.calculatePointsToNextLevel(level),
  );

  if (isUndefined(props.profile)) {
    return (
      <LinearProgress
        color="secondary"
        className={classes.progress}
      />
    );
  }
  return (
    <Box>
      <Tooltip
        arrow
        title={`${userPoints - pointsToReachPreviousLevel}/${
          pointsToReachNextLevel - pointsToReachPreviousLevel
        }`}
      >
        <LinearProgress
          color="secondary"
          value={progressPercent === 100 ? 0 : progressPercent}
          className={cx(
            classes.progress,
            !props.profile && classes.hidden,
          )}
          variant={
            isAnimationActive ? 'indeterminate' : 'determinate'
          }
        />
      </Tooltip>
    </Box>
  );
});

export default ExpirienceProgressBar;
