import { IDayliStreak } from "./IDayliStreak";

export type Profile = {
  userId: string;
  points: number;
  experience: number;
  dailyStreak: IDayliStreak;
  areEcouragingMessagesDisabled: boolean;
  isLoaded: boolean; // react-redux-firebase specific props
  isEmpty: boolean; // react-redux-firebase specific props;
};
