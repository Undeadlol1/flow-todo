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
  handleErrors,
  calculateUserLevel,
} from '../../../services/index';

const log = debug('ExpirienceProgressBar');
debug.enable('ExpirienceProgressBar');
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

  const points = get(profile, 'points', 0);
  const level = calculateUserLevel(points);
  const progressPercent = Number((level % 1).toFixed(2).substring(2));

  log('profile: ', profile);
  log('level', level);
  log('progressPercent: ', progressPercent);

  if (!profile || profileLoading) return null;
  if (profileError) handleErrors(profileError);

  return (
    <LinearProgress
      color="secondary"
      variant="determinate"
      value={progressPercent}
      className={cx([classes.progress, props.className])}
    />
  );
});

export default ExpirienceProgressBar;
