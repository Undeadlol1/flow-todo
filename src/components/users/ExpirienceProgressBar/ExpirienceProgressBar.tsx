import React, { memo } from 'react';
import LinearProgress from '@material-ui/core/LinearProgress';
import { makeStyles } from '@material-ui/core/styles';
import cx from 'clsx';
import { useTypedSelector } from '../../../store';
import debug from 'debug';
import { firestore } from 'firebase/app';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import get from 'lodash/get';
import {
  calculatePointsToNextLevel,
  calculateTotalPointsToReachALevel,
} from '../../../services/index';
import {
  handleErrors,
  calculateUserLevel,
} from '../../../services/index';
import Tooltip from '@material-ui/core/Tooltip';

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
  // @ts-ignore
  const { uid } = useTypedSelector(state => state.firebase.auth);
  const [profile, profileLoading, profileError] = useDocumentData(
    uid && firestore().doc(`profiles/${uid}`),
  );
  const userPoints = get(profile, 'points', 0);
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

  if (profileError) handleErrors(profileError);
  if (profileLoading)
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
        title={userPoints + '/' + pointsToReachNextLevel}
      >
        <LinearProgress
          color="secondary"
          variant="determinate"
          className={cx(!profile && classes.hidden, [
            classes.progress,
            props.className,
          ])}
          value={progressPercent === 100 ? 0 : progressPercent}
        />
      </Tooltip>
    );
});

export default ExpirienceProgressBar;
