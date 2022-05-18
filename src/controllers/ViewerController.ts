import delay from 'lodash/delay';
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
import { toggleRewardModal } from '../store/uiSlice';
import { showLevelUpAnimation } from '../store/uiState';
import { UiController } from './UiController';

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
    try {
      await UiController.temporaryDisplayTaskDoneNotification();
      await ViewerController.rewardPoints(points);
      if (snackbarMessage) {
        return Snackbar.addToQueue(snackbarMessage);
      }
    } catch (error) {
      return Promise.reject(error);
    }
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

    addPointsToUser(viewerId, points);

    return new Promise(resolve => delay(() => {
      store.dispatch(stopPointsRewardingAnimation());
      resolve(undefined);
    }, 3700))
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
}
