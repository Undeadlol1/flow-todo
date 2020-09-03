import DailyStreak from './dailyStreak';
import addDays from 'date-fns/addDays';
import subDays from 'date-fns/esm/subDays';
import { IDayliStreak } from '../store/types';
import isSameDay from 'date-fns/esm/isSameDay';

const today = Date.now()
const tommorow = addDays(today, 1).getTime()
const yesterday = subDays(today, 1).getTime()
const twoDaysAgo = subDays(today, 2).getTime()
const threeDaysAgo = subDays(today, 3).getTime()

function getStreakThatStartsAtAndUpdatedAt(startsAt: number, updatedAt: number): IDayliStreak {
    return {
        perDay: 3,
        startsAt,
        updatedAt,
    }
}

beforeEach(() => DailyStreak.today = today);

describe('DailyStreak', () => {
    it('Detects days in a row properly.', () => {
        expect(DailyStreak.daysInARow({
            perDay: 3,
            startsAt: today,
            updatedAt: tommorow,
        })).toEqual(2);
    });

    it('Should update if started yesterday.', () => {
        const result = DailyStreak.shouldUpdate({
            tasksDoneToday: 3,
            streak: {
                perDay: 3,
                startsAt: yesterday,
                updatedAt: tommorow,
            }
        })
        expect(result).toEqual(true);
    });

    it('Should not update twice per day.', () => {
        const result = DailyStreak.shouldUpdate({
            tasksDoneToday: 5,
            streak: getStreakThatStartsAtAndUpdatedAt(twoDaysAgo, today)
        })
        expect(result).toEqual(false);
    });

    it('Specific case: if started yesterday, dont reset today.', () => {
        DailyStreak.today = today
        const result = DailyStreak.shouldUpdate({
            tasksDoneToday: 5,
            streak: {
                perDay: 3,
                updatedAt: yesterday,
                startsAt: yesterday,
            }
        })
        expect(result).toEqual(true);
    });

    it('Returns proper streak if streak was created yesterday. ', () => {
        const yesterdaysStreak = {
            perDay: 3,
            updatedAt: yesterday,
            startsAt: yesterday,
        }
        const result = DailyStreak.getUpdatedStreak({
            tasksDoneToday: 3,
            streak: yesterdaysStreak,
        })

        expect(result.startsAt).toEqual(yesterdaysStreak.startsAt)
        expect(result.updatedAt !== yesterdaysStreak.updatedAt).toBeTruthy()
        expect(isSameDay(result.updatedAt as number, today)).toBeTruthy()
    });

    it('Returns proper streak if streak was created two days ago. ', () => {
        const streakStartedTwoDaysAgo = {
            perDay: 3,
            updatedAt: yesterday,
            startsAt: twoDaysAgo,
        }
        const result = DailyStreak.getUpdatedStreak({
            tasksDoneToday: 3,
            streak: streakStartedTwoDaysAgo,
        })

        expect(result.startsAt).toEqual(streakStartedTwoDaysAgo.startsAt)
        expect(result.updatedAt !== streakStartedTwoDaysAgo.updatedAt).toBeTruthy()
        expect(isSameDay(result.updatedAt as number, today)).toBeTruthy()
    });

    it('.isBroken detects today properly.', () => {
        const result = DailyStreak.isBroken({
            perDay: 3,
            startsAt: yesterday,
            updatedAt: today,
        })
        expect(result).toEqual(false);
    });

    it('.isBroken returns false for yesterday.', () => {
        const result = DailyStreak.isBroken(
            getStreakThatStartsAtAndUpdatedAt(yesterday, yesterday)
        )
        expect(result).toEqual(false);
    });

    it('.isBroken returns true for tomorrow.', () => {
        const result = DailyStreak.isBroken(
            getStreakThatStartsAtAndUpdatedAt(threeDaysAgo, twoDaysAgo)
        )
        expect(result).toEqual(true);
    });

    it('.isBroken returns true if no  arguments provided.', () => {
        const result = DailyStreak.isBroken(
            undefined as unknown as IDayliStreak
        )
        expect(result).toEqual(true);
    });
});