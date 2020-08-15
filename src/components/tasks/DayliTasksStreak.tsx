import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import React, { memo } from 'react';
import DailyStreak from '../../services/dailyStreak';
import { IDayliStreak } from '../../store/index';

interface Props {
  streak: IDayliStreak
}

const DayliTasksStreak = (props: Props) => {
  const daysInARow = DailyStreak.daysInARow(props.streak);
  const daysSinceUpdate = DailyStreak.daysSinceUpdate(props.streak)

  if (daysInARow === 0 || daysSinceUpdate > 0) return null;

  return (
    <Typography variant="h6">
      <Box fontWeight={100} {...props}>
        {/* TODO i18n */}
        {/* TODO proper first date logic */}
        Задачи выполнены дней подряд: {daysInARow}
      </Box>
    </Typography>
  );
};

export default memo(DayliTasksStreak);
