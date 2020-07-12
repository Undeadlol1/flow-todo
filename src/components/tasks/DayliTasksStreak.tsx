import Box, { BoxProps } from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import React, { memo } from 'react';
import { useSelector } from 'react-redux';
import DailyStreak from '../../services/dailyStreak';
import { profileSelector } from '../../store/selectors';

const DayliTasksStreak = (props: BoxProps) => {
  const { dailyStreak } = useSelector(profileSelector);
  const daysInARow = DailyStreak.daysInARow(dailyStreak);

  if (daysInARow === 0) return null;

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
