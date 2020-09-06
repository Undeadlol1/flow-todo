import debug from 'debug';
import classNames from 'classnames';
import React, { memo } from 'react';
import {
  Box,
  Theme,
  Checkbox,
  CardContent,
  CardHeader,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import Card from '@material-ui/core/Card';
import { FormControlLabel } from '@material-ui/core';
import { DailyGoal } from '../../store/types';

const componentName = 'DayliGoalsList';
const log = debug(componentName);
const useStyles = makeStyles((theme: Theme) => ({ root: {} }));

interface Props {
  goals: DailyGoal[];
  className?: string;
}

const DailyGoalsList = memo((props: Props) => {
  const classes = useStyles();
  const rootClasses = classNames(classes.root, props.className);
  log('props: %O', props);

  return (
    <Box className={rootClasses}>
      {props.goals.map(goal => (
        <Box mb={2} key={goal.id}>
          <Card>
            <CardHeader
              title={goal.name}
              action={<Checkbox color="primary" />}
            />
            <CardContent>
              <FormControlLabel
                control={<Checkbox color="primary" />}
                label='Worked according to "Leave it better than you found it" rule.'
              />
              <br />
              <FormControlLabel
                control={<Checkbox color="primary" />}
                label="Did something really important."
              />
            </CardContent>
          </Card>
        </Box>
      ))}
    </Box>
  );
});

DailyGoalsList.displayName = componentName;

export { DailyGoalsList as DayliGoalsList };
