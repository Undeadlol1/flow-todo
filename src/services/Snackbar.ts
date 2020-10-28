import store from '../store/index';
import {
  addSnackbarToQueue,
  setSnackbars,
} from '../store/snackbarsSlice';

export default class Snackbar {
  private static dispatch = store.dispatch;

  //   public static snackbarsQueue = <string[]>[];

  public static addToQueue(snackbarMesssage: string) {
    this.dispatch(addSnackbarToQueue(snackbarMesssage));
  }

  public static setQueue(queue: string[]) {
    this.dispatch(setSnackbars(queue));
  }
}
