import React from 'react';
import { sections } from '../components/storybookContants';
import DailyStreak from './dailyStreak';
import { streaks } from '../components/dataMocks';
import format from 'date-fns/esm/format';
import { IDayliStreak } from '../store';

export default {
    component: <div />,
    title: sections.services + 'dailyStreak',
};

export const Normal = () => {
    const args: {
        tasksDoneToday: number;
        streak: IDayliStreak;
    }[] = [{
        tasksDoneToday: 3,
        streak: streaks.doneTasksToday
    },
    {
        tasksDoneToday: 3,
        streak: streaks.doneTasksYesterday,
    },
{
    tasksDoneToday: 2,
        streak: streaks.doneTasksYesterday,
}
        ]

    return (
        <div>
            <p>
                NOTE: this story is my stupid way to test dailyStreak service.
      </p>
            <p>NOTE2: i simply couldn't resolve test framework errors.</p>
            <h2>Should update if:</h2>
            {args.map((arg) => {
                return <div>
                    Today: {arg.tasksDoneToday}
                    <br />
              Per day: {arg.streak.perDay}
                    <br />
              Start at: {format(arg.streak?.startsAt as number || 0, 'dd/MM')}
                    <br />
              Updated at: {format(arg.streak?.startsAt as number || 0, 'dd/MM')}
                    <br />
              Should update: {JSON.stringify(DailyStreak.shouldUpdate(arg))}
                    <hr />
                </div>

            })}
        </div>
    );
};
