import delay from 'lodash/delay';
import { promiseDelay } from '../helpers/promiseDelay';
import { addPointsToUser } from '../repositories/addPointsToUser';
import { upsertProfile } from '../repositories/upsertProfile';
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
  profileSelector,
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

  private static get viewer() {
    return profileSelector(this.state);
  }

  private static get viewerId(): string {
    return authSelector(this.state).uid;
  }

  static rewardUserForWorkingOnATask = async ({
    points,
    snackbarMessage,
  }: {
    points: number;
    snackbarMessage?: string;
  }) => {
    return ViewerController.toggleTaskDoneNotification()
      .then(() => promiseDelay(3500))
      .then(() => ViewerController.toggleTaskDoneNotification())
      .then(() => ViewerController.rewardPoints(points))
      .then(() => {
        if (snackbarMessage) {
          return Snackbar.addToQueue(snackbarMessage);
        }
      });
  };

  static async rewardPoints(points: number) {
    const { state, viewerId } = ViewerController;
    const profilePoints = profilePointsSelector(state);
    const isRewardUnlocked = !!getNewlyUnlockedReward(
      profilePoints,
      points,
      rewardsSelector(state),
    );

    if (LevelingService.willUserLevelUp(profilePoints, points)) {
      showLevelUpAnimation();
    }

    if (isRewardUnlocked) {
      store.dispatch(toggleRewardModal());
    }

    store.dispatch(startPointsRewardingAnimation(points));
    delay(() => store.dispatch(stopPointsRewardingAnimation()), 3500);
    return addPointsToUser(viewerId, points);
  }

  static async resetPoints() {
    return upsertProfile({
      ...this.viewer,
      points: 0,
    });
  }

  static async resetExperience() {
    return upsertProfile({
      ...this.viewer,
      experience: 0,
    });
  }

  private static toggleTaskDoneNotification = (): Promise<void> => {
    store.dispatch(toggleTasksDoneTodayNotification());
    return Promise.resolve();
  };
}
