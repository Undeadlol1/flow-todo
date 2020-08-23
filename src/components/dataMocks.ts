import addDays from "date-fns/esm/addDays"
import { IDayliStreak } from "../store"
import subDays from "date-fns/esm/subDays";

const today = new Date()
const yesterday = subDays(today, 1);

export const streaks = {
    doneTasksToday: {
        startsAt: today,
        updatedAt: addDays(new Date(), 3),
    } as IDayliStreak,
    streakIsBorken: {
        startsAt: subDays(today, 3),
        updatedAt: yesterday,
    } as IDayliStreak,
}