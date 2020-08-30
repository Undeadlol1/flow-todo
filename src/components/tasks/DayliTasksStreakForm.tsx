import { Card, CardContent, TextField } from '@material-ui/core';
import React, { ChangeEvent, memo } from 'react';
import { useTypedSelector } from '../../store';
import { upsertProfile } from '../../store/index';
import { profileSelector, userIdSelector } from '../../store/selectors';

function DayliTasksStreakForm() {
  // const [t] = useTranslation();
  const userId = useTypedSelector(userIdSelector);
  const profile = useTypedSelector(profileSelector);
  const tasksPerDay = profile?.dailyStreak?.perDay

  const onChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const selectedNumber = Number(e.target.value || 0);
    if (!selectedNumber) return;
    if (selectedNumber === tasksPerDay) return;

    await upsertProfile(userId, {
      ...profile,
      userId,
      dailyStreak: {
        ...profile.dailyStreak,
        perDay: selectedNumber,
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
          disabled={!profile?.userId}
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
