import {
  getNewlyUnlockedReward,
  showLevelUpAnimation,
} from '../services/index';
import LevelingService from '../services/Leveling';
import {
  authSelector,
  profilePointsSelector,
  rewardsSelector,
} from '../store/selectors';
import { toggleRewardModal } from '../store/uiSlice';
import { addPointsToUser } from './addPointsToUser';
import { store } from '../store/index';

export function addPointsWithSideEffects(
  userId: string,
  points: number,
): Promise<void> {
  const state = store.getState();
  const auth = authSelector(state);
  const profilePoints = profilePointsSelector(state);
  const nextReward = getNewlyUnlockedReward(
    profilePoints,
    points,
    rewardsSelector(state),
  );
  // TODO refactor
  if (nextReward) store.dispatch(toggleRewardModal());
  if (LevelingService.willUserLevelUp(profilePoints, points)) {
    showLevelUpAnimation();
  }

  return addPointsToUser(auth.uid, points);
}
