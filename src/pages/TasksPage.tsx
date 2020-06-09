import { makeStyles } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import debug from 'debug';
import React, { memo } from 'react';
import CreateReward from '../components/rewards/CreateReward';
import RewardsList from '../components/rewards/RewardsList';
import { useTypedSelector } from '../store/index';
import { rewardsSelector, tasksSelector } from '../store/selectors';
import { TasksList } from './../components/tasks/TasksList/TasksList';

const log = debug('RewardsPage');
const useStyles = makeStyles(theme => ({
  pageContainer: {
    marginBottom: 0,
    marginTop: theme.spacing(4),
    minHeight: 'calc(100vh - 74px)',
  },
}));

interface Props {}

const RewardsPage: React.FC<Props> = () => {
  const cx = useStyles();
  const tasks = useTypedSelector(tasksSelector);
  log('tasks: %O', tasks);

  return (
    <Box className={cx.pageContainer}>
      <Grid container justify="center" spacing={2}>
        <Grid item xs={12} sm={8} md={8} lg={6}>
          <CreateReward />
        </Grid>
      </Grid>
      <Grid container justify="center">
        <Grid container item xs={12} sm={8} md={8} lg={6}>
          <TasksList tasks={{ docs: tasks }} />
        </Grid>
      </Grid>
    </Box>
  );
};

export default memo(RewardsPage);
