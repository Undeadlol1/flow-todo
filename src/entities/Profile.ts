import { DailyStreak } from './DailyStreak';

export type Profile = {
  userId: string;
  points: number;
  experience: number;
  dailyStreak: DailyStreak;
  areEcouragingMessagesDisabled: boolean;
  isLoaded: boolean; // react-redux-firebase specific props
  isEmpty: boolean; // react-redux-firebase specific props;
};
