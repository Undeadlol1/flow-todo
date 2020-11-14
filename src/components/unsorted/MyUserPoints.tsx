import React, { memo } from 'react';
import { useTypedSelector } from '../../store';
import {
  profilePointsSelector,
  profileSelector,
} from '../../store/selectors';
import UserPoints from '../users/UserPoints';

interface Props {}

const MyUserPoints = memo((props: Props) => {
  const profile = useTypedSelector(profileSelector);
  const points = useTypedSelector(profilePointsSelector);

  return <UserPoints value={points} isLoaded={profile.isLoaded} />;
});

MyUserPoints.displayName = 'MyUserPoints';

export { MyUserPoints };
