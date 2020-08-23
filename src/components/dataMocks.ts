import { IDayliStreak } from "../store"
import subDays from "date-fns/esm/subDays";

const today = new Date()
const yesterday = subDays(today, 1);

export const streaks = {
    doneTasksYesterday: {
        startsAt: yesterday,
        updatedAt: yesterday,
    } as IDayliStreak,
    doneTasksToday: {
        startsAt: today,
        updatedAt: today,
    } as IDayliStreak,
    doneTasksFewDays: {
        startsAt: subDays(today, 4),
        updatedAt: today
    } as IDayliStreak,
    streakIsBroken: {
        startsAt: subDays(today, 5),
        updatedAt: subDays(today, 3),
    } as IDayliStreak,
}