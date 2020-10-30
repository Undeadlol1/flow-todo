import { Card, CardContent, TextField } from '@material-ui/core';
import React, { ChangeEvent, memo } from 'react';
import { upsertProfile } from '../../store';
import { profileSelector } from '../../store/selectors';
import debug from 'debug';
import Snackbar from '../../services/Snackbar';
import { useSelector } from 'react-redux';

const log = debug('DayliTasksStreakForm');
// TODO: remove this line.
debug.enable('DayliTasksStreakForm')

function DayliTasksStreakForm() {
  const profile = useSelector(profileSelector);
  const tasksPerDay = profile?.dailyStreak?.perDay;

  async function onChange(e: ChangeEvent<HTMLInputElement>) {
    const selectedNumber = Number(e.target.value || 0);
    log('Value changed.', selectedNumber);

    if (!selectedNumber || selectedNumber === tasksPerDay) {
      log('Not updating.');
      return;
    }

    const mergedProfile ={
      ...profile,
      dailyStreak: {
        ...profile.dailyStreak,
        perDay: selectedNumber,
      },
    }
    log('Updating with this values: ', mergedProfile)

    upsertProfile(mergedProfile)
    .catch(e => Snackbar.addToQueue(e.message));
  }

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
