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

const log = debug('ExpirienceProgressBar');
const useStyles = makeStyles(theme => ({
  progress: {
    height: 10,
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

  if (!profile || profileLoading) return null;
  if (profileError) handleErrors(profileError);

  return (
    <LinearProgress
      color="secondary"
      variant="determinate"
      className={cx([classes.progress, props.className])}
      value={progressPercent === 100 ? 0 : progressPercent}
    />
  );
});

export default ExpirienceProgressBar;
