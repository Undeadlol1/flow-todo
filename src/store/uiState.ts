import store from './index';
import { toggleLevelUpAnimation } from './usersSlice';
import { toggleSidebar as toggleUiSidebar } from './uiSlice';

export function showLevelUpAnimation() {
  store.dispatch(toggleLevelUpAnimation());
  setTimeout(() => store.dispatch(toggleLevelUpAnimation()), 5000);
}

export function toggleSidebar() {
  store.dispatch(toggleUiSidebar());
}

export class UiState {
  static toggleSidebar = toggleSidebar;
  static showLevelUpAnimation = showLevelUpAnimation;
}
