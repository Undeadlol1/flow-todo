import { Card, CardContent, TextField } from '@material-ui/core';
import React, { ChangeEvent, memo } from 'react';
import { useTypedSelector } from '../../store';
import { upsertProfile } from '../../store/index';
import {
  profileSelector,
  tasksPerDaySelector,
  userIdSelector,
} from '../../store/selectors';

function DayliTasksStreakForm() {
  // const [t] = useTranslation();
  const tasksPerDay = useTypedSelector(tasksPerDaySelector);
  const profile = useTypedSelector(profileSelector);
  const userId = useTypedSelector(userIdSelector);

  const onChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const number = Number(e.target.value || 0);
    if (!number) return;
    if (number === tasksPerDay) return;
    console.log('number: ', number);
    await upsertProfile(userId, {
      ...profile,
      userId,
      dailyStreak: {
        ...profile.dailyStreak,
        perDay: number,
      },
    });
  };

  return (
    <Card>
      <CardContent>
        <TextField
          fullWidth
          type="number"
          name="perDay"
          // variant="outlined"
          autoComplete="off"
          // className={cx.input}
          // TODO i18n
          label="Задач в день"
          // label={t('')}
          defaultValue={tasksPerDay}
          onChange={onChange}
        />
      </CardContent>
    </Card>
  );
}

export default memo(DayliTasksStreakForm);
