import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import debug from 'debug';
import React, { memo } from 'react';
import { useTypedTranslate } from '../../services';
import DailyStreak from '../../services/dailyStreak';
import { DailyStreak as IDailyStreak } from '../../entities/DailyStreak';
import { NumbersAnimatedOnUpdate } from '../ui/NumbersAnimatedOnUpdate';

const componentName = 'DailyTasksStreak';
const log = debug(componentName);

export interface DailyTasksStreakProps {
  streak: IDailyStreak;
  isUpdateAnimationDisabled?: boolean;
}

const DailyTasksStreak = memo(
  ({ streak, isUpdateAnimationDisabled }: DailyTasksStreakProps) => {
    const t = useTypedTranslate();

    const dailyStreakService = new DailyStreak(streak);
    let daysInARow = dailyStreakService.getDaysInARow();
    const daysSinceUpdate = dailyStreakService.daysSinceUpdate();

    if (daysSinceUpdate === undefined || daysSinceUpdate > 1) {
      daysInARow = 0;
    }

    log('streak.startsAt: ', new Date(streak?.startsAt as number));
    log('streak.updatedAt: ', new Date(streak?.updatedAt as number));
    log('daysInARow: ', daysInARow);
    log('daysSinceUpdate: ', daysSinceUpdate);

    return (
      <Typography variant="h6">
        <Box fontWeight={100}>
          {t('won_days_in_a_row')}:{' '}
          <NumbersAnimatedOnUpdate
            value={daysInARow}
            isAnimationDisabled={isUpdateAnimationDisabled}
          />
        </Box>
      </Typography>
    );
  },
);

export default memo(DailyTasksStreak);
