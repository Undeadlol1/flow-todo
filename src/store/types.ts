export type IDayliStreak = {
    perDay: number;
    startsAt: number | null;
    updatedAt: number | null;
};

export type DailyGoal = {
    id: string;
    name: string;
    streak: IDayliStreak;
};
