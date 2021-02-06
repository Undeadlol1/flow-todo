import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import debug from 'debug';
import React, { memo } from 'react';
import { useTypedTranslate } from '../../services';
import DailyStreak from '../../services/dailyStreak';
import { IDailyStreak } from '../../entities/IDailyStreak';
import { NumbersAnimatedOnUpdate } from '../ui/NumbersAnimatedOnUpdate';

const componentName = 'DailyTasksStreak';
const log = debug(componentName);

interface Props {
  streak: IDailyStreak;
  isUpdateAnimationDisabled?: boolean;
}

const DailyTasksStreak = memo(
  ({ streak, isUpdateAnimationDisabled }: Props) => {
    const t = useTypedTranslate();

    let daysInARow = DailyStreak.daysInARow(streak);
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
