import { IDailyStreak } from './IDailyStreak';

export type Profile = {
  userId: string;
  points: number;
  experience: number;
  dailyStreak: IDailyStreak;
  areEcouragingMessagesDisabled: boolean;
  isLoaded: boolean; // react-redux-firebase specific props
  isEmpty: boolean; // react-redux-firebase specific props;
};
