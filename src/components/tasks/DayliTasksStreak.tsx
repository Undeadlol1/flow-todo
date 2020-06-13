import React, { memo } from 'react';
import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import { useSelector } from 'react-redux';
import { profileSelector } from '../../store/selectors';
import differenceInDays from 'date-fns/differenceInDays';

const DayliTasksStreak = () => {
  const { dailyStreak } = useSelector(profileSelector);
  const daysInARow = differenceInDays(
    dailyStreak.updatedAt,
    dailyStreak.startsAt,
  );

  if (daysInARow <= 0) return null;
  return (
    <Box mt={4}>
      <Card>
        <CardContent>
          <Typography>
            Задачи выполнены дней подряд: {daysInARow}
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default memo(DayliTasksStreak);
