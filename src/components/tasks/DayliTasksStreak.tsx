import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { subDays } from 'date-fns/esm';
import debug from 'debug';
import React, { memo } from 'react';
import { IDayliStreak } from '../../entities/IDayliStreak';
import {
  distanceBetweenDates,
  useTypedTranslate,
} from '../../services';
import DailyStreak from '../../services/dailyStreak';

const componentName = 'DayliTasksStreak';
const log = debug(componentName);

interface Props {
  streak: IDayliStreak;
  isUpdateAnimationDisabled?: boolean;
}

const DayliTasksStreak = memo(
  ({ streak, isUpdateAnimationDisabled }: Props) => {
    const t = useTypedTranslate();

    let daysInARow = DailyStreak.daysInARow(streak);
    let relative = distanceBetweenDates(
      streak.updatedAt || Date.now(),
      streak.startsAt || Date.now(),
    );
    const daysSinceUpdate = DailyStreak.daysSinceUpdate(streak);

    log('streak.startsAt: ', new Date(streak?.startsAt as number));
    log('streak.updatedAt: ', new Date(streak?.updatedAt as number));
    log('daysInARow: ', daysInARow);
    log('daysSinceUpdate: ', daysSinceUpdate);

    if (daysSinceUpdate === undefined || daysSinceUpdate > 1) {
      relative = distanceBetweenDates(
        streak.startsAt || Date.now(),
        subDays(streak.updatedAt || Date.now(), 1),
      );
    }
    return (
      <Typography variant="h6">
        <Box fontWeight={100}>
          {t('won_days_in_a_row')}: {relative}
        </Box>
      </Typography>
    );
  },
);

export default memo(DayliTasksStreak);
