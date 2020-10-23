import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import debug from 'debug';
import React, { memo } from 'react';
import { useTypedTranslate } from '../../services';
import DailyStreak from '../../services/dailyStreak';
import { IDayliStreak } from '../../store/index';
import { NumbersAnimatedOnUpdate } from '../unsorted/NumbersAnimatedOnUpdate';

const componentName = 'DayliTasksStreak';
const log = debug(componentName);

interface Props {
  streak: IDayliStreak;
}

const DayliTasksStreak = memo(({ streak }: Props) => {
  const t = useTypedTranslate();

  let daysInARow = DailyStreak.daysInARow(streak) + 1;
  const daysSinceUpdate = DailyStreak.daysSinceUpdate(streak);

  log('streak.startsAt: ', new Date(streak?.startsAt as number));
  log('streak.updatedAt: ', new Date(streak?.updatedAt as number));
  log('daysInARow: ', daysInARow);
  log('daysSinceUpdate: ', daysSinceUpdate);

  if (daysSinceUpdate === undefined || daysSinceUpdate > 1) {
    daysInARow = 0;
  }
  return (
    <Typography variant="h6">
      <Box fontWeight={100}>
        {t('won_days_in_a_row')}: <NumbersAnimatedOnUpdate value={daysInARow} />
      </Box>
    </Typography>
  );
});

export default memo(DayliTasksStreak);
