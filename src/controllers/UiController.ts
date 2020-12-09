import store from '../store';
import { toggleSidebar } from '../store/uiSlice';

export class UiController {
  public static toggleSidebar() {
    store.dispatch(toggleSidebar());
  }
}
