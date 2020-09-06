import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import debug from 'debug';
import React, { memo } from 'react';
import DailyStreak from '../../services/dailyStreak';
import { IDayliStreak } from '../../store/index';

const componentName = 'DayliTasksStreak';
const log = debug(componentName);
debug.enable(componentName)

interface Props {
  streak: IDayliStreak;
}

const DayliTasksStreak = memo((props: Props) => {
  const daysInARow = DailyStreak.daysInARow(props.streak);
  const daysSinceUpdate = DailyStreak.daysSinceUpdate(props.streak);
  log('streak.startsAt: ',new Date(props.streak?.startsAt as number));
  log('streak.updatedAt: ', new Date(props.streak?.updatedAt as number));
  log('daysInARow: ', daysInARow);

  if (daysSinceUpdate > 1) {
    log('daysSinceUpdate: ', daysSinceUpdate);
    log('Hiding this component.')
    return null;
  }
  else
    return (
      <Typography variant="h6">
        <Box fontWeight={100} {...props}>
          {/* TODO i18n */}
          {/* TODO proper first date logic */}
          Задачи выполнены дней подряд: {daysInARow}
        </Box>
      </Typography>
    );
});

DayliTasksStreak.displayName = componentName;

export default memo(DayliTasksStreak);
