import addDays from "date-fns/esm/addDays"
import { IDayliStreak } from "../store"

const today = new Date()

export const streaks = {
    doneTasksToday: {
        startsAt: today,
        updatedAt: addDays(new Date(), 3),
    } as IDayliStreak,
}