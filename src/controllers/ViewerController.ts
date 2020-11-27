import delay from 'lodash/delay';
import { addPointsToUser } from '../repositories/addPointsToUser';
import { getNewlyUnlockedReward } from '../services';
import LevelingService from '../services/Leveling';
import Snackbar from '../services/Snackbar';
import {
  startPointsRewardingAnimation,
  stopPointsRewardingAnimation,
} from '../store/animationSlice';
import store from '../store/index';
import {
  authSelector,
  profilePointsSelector,
  rewardsSelector,
} from '../store/selectors';
import {
  toggleRewardModal,
  toggleTasksDoneTodayNotification,
} from '../store/uiSlice';
import { showLevelUpAnimation } from '../store/uiState';

export class ViewerController {
  private static get state() {
    return store.getState();
  }

  private static get viewerId(): string {
    const auth = authSelector(ViewerController.state);
    return auth.uid;
  }

  static async rewardUserWithPoints(points: number) {
    const { state, viewerId } = ViewerController;
    const profilePoints = profilePointsSelector(state);
    const nextReward = getNewlyUnlockedReward(
      profilePoints,
      points,
      rewardsSelector(state),
    );
    if (LevelingService.willUserLevelUp(profilePoints, points)) {
      showLevelUpAnimation();
    }
    if (nextReward) {
      store.dispatch(toggleRewardModal());
    }

    store.dispatch(startPointsRewardingAnimation(points));
    delay(() => store.dispatch(stopPointsRewardingAnimation()), 3500);
    return addPointsToUser(viewerId, points);
  }

  static rewardUserForWorkingOnATask = ({
    points,
    snackbarMessage,
  }: {
    points: number;
    snackbarMessage: string;
  }) => {
    ViewerController.toggleTaskDoneNotification();
    delay(() => {
      ViewerController.toggleTaskDoneNotification()
        .then(() => ViewerController.rewardUserWithPoints(points))
        .then(() => Snackbar.addToQueue(snackbarMessage));
    }, 3500);
  };

  private static toggleTaskDoneNotification = (): Promise<void> => {
    store.dispatch(toggleTasksDoneTodayNotification());
    return Promise.resolve();
  };
}
