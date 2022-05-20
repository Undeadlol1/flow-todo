import DailyStreak from './dailyStreak';
import addDays from 'date-fns/addDays';
import subDays from 'date-fns/esm/subDays';
import isSameDay from 'date-fns/esm/isSameDay';
import { DailyStreak as IDailyStreak } from '../entities/DailyStreak';

const today = Date.now();
const tommorow = addDays(today, 1).getTime();
const yesterday = subDays(today, 1).getTime();
const twoDaysAgo = subDays(today, 2).getTime();
const threeDaysAgo = subDays(today, 3).getTime();

function getStreakThatStartsAtAndUpdatedAt(
  startsAt: number,
  updatedAt: number,
): IDailyStreak {
  return {
    perDay: 3,
    startsAt,
    updatedAt,
  };
}

beforeEach(() => (DailyStreak.today = today));

describe('DailyStreak', () => {
  it('Detects days in a row properly.', () => {
    expect(
      new DailyStreak({
        perDay: 3,
        startsAt: today,
        updatedAt: tommorow,
      }).getDaysInARow(),
    ).toEqual(2);
  });

  it('Should update if started yesterday.', () => {
    const result = new DailyStreak({
      perDay: 3,
      startsAt: yesterday,
      updatedAt: tommorow,
    }).shouldUpdate({
      tasksDoneToday: 3,
    });
    expect(result).toEqual(true);
  });

  it('Should not update twice per day.', () => {
    const result = new DailyStreak(
      getStreakThatStartsAtAndUpdatedAt(twoDaysAgo, today),
    ).shouldUpdate({
      tasksDoneToday: 5,
    });
    expect(result).toEqual(false);
  });

  it('Specific case: if started yesterday, dont reset today.', () => {
    DailyStreak.today = today;
    const result = new DailyStreak({
      perDay: 3,
      updatedAt: yesterday,
      startsAt: yesterday,
    }).shouldUpdate({
      tasksDoneToday: 5,
    });
    expect(result).toEqual(true);
  });

  it("Specific case: if started two days ago, don't reset.", () => {
    DailyStreak.today = today;
    const result = new DailyStreak({
      perDay: 3,
      startsAt: twoDaysAgo,
      updatedAt: yesterday,
    }).shouldUpdate({
      tasksDoneToday: 5,
    });
    expect(result).toEqual(true);
  });

  it('Returns proper streak if streak was created yesterday.', () => {
    const yesterdaysStreak = {
      perDay: 3,
      updatedAt: yesterday,
      startsAt: yesterday,
    };
    const result = new DailyStreak(yesterdaysStreak).getUpdatedStreak(
      {
        tasksDoneToday: 3,
      },
    );

    expect(result.startsAt).toEqual(yesterdaysStreak.startsAt);
    expect(
      result.updatedAt !== yesterdaysStreak.updatedAt,
    ).toBeTruthy();
    expect(isSameDay(result.updatedAt as number, today)).toBeTruthy();
  });

  it('Returns proper streak if streak was created two days ago.', () => {
    const yesterdaysStreak = {
      perDay: 3,
      updatedAt: yesterday,
      startsAt: twoDaysAgo,
    };
    const result = new DailyStreak(yesterdaysStreak).getUpdatedStreak(
      {
        tasksDoneToday: 3,
      },
    );

    expect(result.startsAt).toEqual(yesterdaysStreak.startsAt);
    expect(
      result.updatedAt !== yesterdaysStreak.updatedAt,
    ).toBeTruthy();
    expect(isSameDay(result.updatedAt as number, today)).toBeTruthy();
  });

  it('Returns proper streak if streak was created two days ago. ', () => {
    const streakStartedTwoDaysAgo = {
      perDay: 3,
      updatedAt: yesterday,
      startsAt: twoDaysAgo,
    };
    const result = new DailyStreak(
      streakStartedTwoDaysAgo,
    ).getUpdatedStreak({
      tasksDoneToday: 3,
    });

    expect(result.startsAt).toEqual(streakStartedTwoDaysAgo.startsAt);
    expect(
      result.updatedAt !== streakStartedTwoDaysAgo.updatedAt,
    ).toBeTruthy();
    expect(isSameDay(result.updatedAt as number, today)).toBeTruthy();
  });

  it('.isBroken detects today properly.', () => {
    const result = new DailyStreak({
      perDay: 3,
      startsAt: yesterday,
      updatedAt: today,
    }).isBroken();
    expect(result).toEqual(false);
  });

  it('.isBroken returns false for yesterday.', () => {
    const result = new DailyStreak(
      getStreakThatStartsAtAndUpdatedAt(yesterday, yesterday),
    ).isBroken();
    expect(result).toEqual(false);
  });

  it('.isBroken returns true for tomorrow.', () => {
    const result = new DailyStreak(
      getStreakThatStartsAtAndUpdatedAt(threeDaysAgo, twoDaysAgo),
    ).isBroken();
    expect(result).toEqual(true);
  });

  it('.isBroken returns true if no  arguments provided.', () => {
    const result = new DailyStreak(
      (undefined as unknown) as IDailyStreak,
    ).isBroken();
    expect(result).toEqual(true);
  });
});
