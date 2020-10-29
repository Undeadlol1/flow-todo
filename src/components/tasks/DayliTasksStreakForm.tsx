import { Card, CardContent, TextField } from '@material-ui/core';
import React, { ChangeEvent, memo } from 'react';
import { useTypedSelector, upsertProfile } from '../../store';

import { profileSelector } from '../../store/selectors';

function DayliTasksStreakForm() {
  // const [t] = useTranslation();
  const profile = useTypedSelector(profileSelector);
  const tasksPerDay = profile?.dailyStreak?.perDay;

  const onChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const selectedNumber = Number(e.target.value || 0);

    if (!selectedNumber) return;
    if (selectedNumber === tasksPerDay) return;

    await upsertProfile({
      ...profile,
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
          autoComplete="off"
          disabled={!profile?.userId}
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
