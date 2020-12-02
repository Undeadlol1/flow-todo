import store from '../store/index';
import {
  addSnackbarToQueue,
  updateSnackbarsQueue,
} from '../store/snackbarsSlice';

export default class Snackbar {
  private static dispatch = store?.dispatch;

  public static addToQueue(snackbarMesssage: string): void {
    this.dispatch(addSnackbarToQueue(snackbarMesssage));
  }

  public static addToQueueFP(snackbarMesssage: string): () => void {
    return () => this.addToQueue(snackbarMesssage);
  }

  public static updateQueue(queue: string[]) {
    this.dispatch(updateSnackbarsQueue(queue));
  }
}
