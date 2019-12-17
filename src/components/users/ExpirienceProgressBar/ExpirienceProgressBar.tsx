import LinearProgress from '@material-ui/core/LinearProgress';
import { makeStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import cx from 'clsx';
import debug from 'debug';
import get from 'lodash/get';
import isUndefined from 'lodash/isUndefined';
import React, { memo } from 'react';
import {
  calculatePointsToNextLevel,
  calculateTotalPointsToReachALevel,
  calculateUserLevel,
} from '../../../services/index';
import { Profile, useTypedSelector } from '../../../store';

const log = debug('ExpirienceProgressBar');
const useStyles = makeStyles(theme => ({
  progress: {
    height: 10,
  },
  hidden: {
    opacity: 0,
  },
}));

export const ExpirienceProgressBar: React.FC<{
  className?: string;
}> = memo(props => {
  const classes = useStyles();
  const { isLevelUpAnimationActive } = useTypedSelector(s => s.users);
  const profile = useTypedSelector(
    s => s.firestore.data.profile as Profile,
  );
  const userPoints = get(profile, 'experience', 0);
  const level = calculateUserLevel(userPoints);

  const pointsToReachPreviousLevel = calculateTotalPointsToReachALevel(
    level,
  );
  const pointsToReachNextLevel = calculateTotalPointsToReachALevel(
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
    pointsToReachPreviousLevel + calculatePointsToNextLevel(level),
  );
  log('progressPercent: ', progressPercent);

  if (isUndefined(profile))
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
          className={cx(!profile && classes.hidden, [
            classes.progress,
            props.className,
          ])}
          variant={
            isLevelUpAnimationActive ? 'indeterminate' : 'determinate'
          }
        />
      </Tooltip>
    );
});

export default ExpirienceProgressBar;
