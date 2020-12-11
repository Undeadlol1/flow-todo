import store from '../store';
import {
  toggleSidebar,
  toggleTasksDoneTodayNotification,
} from '../store/uiSlice';
import { promiseDelay } from '../helpers/promiseDelay';

export class UiController {
  public static toggleSidebar() {
    store.dispatch(toggleSidebar());
  }

  public static async temporaryDisplayTaskDoneNotification() {
    UiController.toggleTaskDoneNotification();
    await promiseDelay(3500);
    return UiController.toggleTaskDoneNotification();
  }

  private static toggleTaskDoneNotification = (): Promise<void> => {
    store.dispatch(toggleTasksDoneTodayNotification());
    return Promise.resolve();
  };
}
