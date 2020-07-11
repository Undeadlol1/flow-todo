import Box, { BoxProps } from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import differenceInDays from 'date-fns/differenceInDays';
import React, { memo } from 'react';
import { useSelector } from 'react-redux';
import { profileSelector } from '../../store/selectors';

const DayliTasksStreak = (props: BoxProps) => {
  const { startsAt, updatedAt } = useSelector(
    profileSelector,
  ).dailyStreak;

  console.log('updatedAt: ', updatedAt);
  console.log('startsAt: ', startsAt);

  if (!startsAt || !updatedAt) return null;

  const daysInARow = differenceInDays(updatedAt, startsAt);
  return (
    <Typography variant="h6">
      <Box fontWeight={100} {...props}>
        {/* TODO i18n */}
        {/* TODO proper first date logic */}
        Задачи выполнены дней подряд: {daysInARow + 1}
      </Box>
    </Typography>
  );
};

export default memo(DayliTasksStreak);
