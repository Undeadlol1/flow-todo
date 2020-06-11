import { makeStyles } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import debug from 'debug';
import React, { memo } from 'react';
// import { TasksList } from './../components/tasks/TasksList/TasksList';
import { useTypedSelector } from '../store';
import { tasksSelector } from '../store/selectors';

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
      <Grid container justify="center">
        <Grid container item xs={12} sm={8} md={8} lg={6}>
          {/* <TasksList tasks={{ docs: tasks }} /> */}
        </Grid>
      </Grid>
    </Box>
  );
};

export default memo(RewardsPage);
