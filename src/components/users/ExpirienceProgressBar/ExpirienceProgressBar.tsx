import LinearProgress from '@material-ui/core/LinearProgress';
import { makeStyles } from '@material-ui/styles';
import Tooltip from '@material-ui/core/Tooltip';
import cx from 'clsx';
import debug from 'debug';
import get from 'lodash/get';
import isUndefined from 'lodash/isUndefined';
import React, { memo } from 'react';
import LevelingService from '../../../services/leveling';
import { Theme } from '@material-ui/core';
import { Profile } from '../../../store/index';

const log = debug('ExpirienceProgressBar');
const useStyles = makeStyles((theme: Theme) => ({
  progress: {
    height: 10,
  },
  hidden: {
    opacity: 0,
  },
}));

interface Props {}

export const ExpirienceProgressBar: React.FC<{
  profile?: Profile;
  className?: string;
  isAnimationActive: boolean;
}> = memo(props => {
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
  log(
    'points to next level',
    pointsToReachPreviousLevel +
      LevelingService.calculatePointsToNextLevel(level),
  );
  log('progressPercent: ', progressPercent);

  if (isUndefined(props.profile))
    return (
      <LinearProgress
        color="secondary"
        className={cx([classes.progress, props.className])}
      />
    );
  else
    return (
      <Tooltip
        arrow
        title={
          userPoints -
          pointsToReachPreviousLevel +
          '/' +
          (pointsToReachNextLevel - pointsToReachPreviousLevel)
        }
      >
        <LinearProgress
          color="secondary"
          value={progressPercent === 100 ? 0 : progressPercent}
          className={cx(!props.profile && classes.hidden, [
            classes.progress,
            props.className,
          ])}
          variant={
            props.isAnimationActive ? 'indeterminate' : 'determinate'
          }
        />
      </Tooltip>
    );
});

export default ExpirienceProgressBar;
