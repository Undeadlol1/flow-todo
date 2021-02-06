import { Card, CardContent, TextField } from '@material-ui/core';
import React, { ChangeEvent, memo } from 'react';
import { profileSelector } from '../../store/selectors';
import debug from 'debug';
import Snackbar from '../../services/Snackbar';
import { useSelector } from 'react-redux';
import { upsertProfile } from '../../repositories/upsertProfile';
import { useTypedTranslate } from '../../services';

const log = debug('DailyTasksStreakForm');

function DailyTasksStreakForm() {
  const t = useTypedTranslate();
  const profile = useSelector(profileSelector);
  const tasksPerDay = profile?.dailyStreak?.perDay;

  async function onChange(e: ChangeEvent<HTMLInputElement>) {
    const selectedNumber = Number(e.target.value || 0);
    log('Value changed.', selectedNumber);

    if (!selectedNumber || selectedNumber === tasksPerDay) {
      log('Not updating.');
      return;
    }

    const mergedProfile = {
      ...profile,
      dailyStreak: {
        ...profile.dailyStreak,
        perDay: selectedNumber,
      },
    };
    log('Updating with this values: ', mergedProfile);

    upsertProfile(mergedProfile).catch((e) =>
      Snackbar.addToQueue(e.message),
    );
  }

  return (
    <Card>
      <CardContent>
        <TextField
          fullWidth
          type="number"
          name="perDay"
          autoComplete="off"
          disabled={!profile.isLoaded}
          label={t('tasks_per_day')}
          defaultValue={tasksPerDay}
          onChange={onChange}
        />
      </CardContent>
    </Card>
  );
}

export default memo(DailyTasksStreakForm);
