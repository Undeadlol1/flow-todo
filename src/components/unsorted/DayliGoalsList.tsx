import debug from 'debug';
import classNames from 'classnames';
import React, { memo } from 'react';
import { Box, Theme, Checkbox } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import DailyStreak from '../../services/dailyStreak';

const log = debug('DayliGoalsList');

const useStyles = makeStyles((theme: Theme) => ({ root: {} }));

export type DailyGoal = {
  id: string;
  name: string;
  streak: DailyStreak;
};

interface Props {
  goals: DailyGoal[];
  className?: string;
}

const DayliGoalsList = memo((props: Props) => {
  const classes = useStyles();
  const rootClasses = classNames(classes.root, props.className);

  return (
    <Box className={rootClasses}>
      {props.goals.map(goal => (
        <Box>
          <Checkbox color="primary" />
          {goal.name}
        </Box>
      ))}
    </Box>
  );
});

DayliGoalsList.displayName = 'DayliGoalsList';

export { DayliGoalsList };
