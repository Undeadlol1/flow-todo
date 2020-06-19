import React, { memo } from 'react';
import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import { useSelector } from 'react-redux';
import { profileSelector } from '../../store/selectors';
import differenceInDays from 'date-fns/differenceInDays';

const DayliTasksStreak = () => {
  const { startsAt, updatedAt } = useSelector(
    profileSelector,
  ).dailyStreak;

  if (!startsAt) return null;

  const daysInARow = differenceInDays(updatedAt, startsAt);
  return (
    <Box mt={4}>
      <Card>
        <CardContent>
          <Typography>
            {/* TODO i18n */}
            Задачи выполнены дней подряд: {daysInARow + 1}
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default memo(DayliTasksStreak);
