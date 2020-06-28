import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import debug from 'debug';
import React, { memo } from 'react';
import { TasksList } from './../components/tasks/TasksList/TasksList';
import { useTypedSelector } from '../store';
import { tasksSelector } from '../store/selectors';

const log = debug('RewardsPage');
const useStyles = makeStyles(theme => ({
  pageContainer: {
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(4),
    minHeight: 'calc(100vh - 74px)',
  },
}));

const RewardsPage: React.FC<{}> = () => {
  const cx = useStyles();
  const tasks = useTypedSelector(tasksSelector);
  log('tasks: %O', tasks);

  return (
    <Grid container justify="center" className={cx.pageContainer}>
      <Grid container item xs={12} sm={8} md={8} lg={6}>
        <TasksList tasks={tasks || []} />
      </Grid>
    </Grid>
  );
};

export default memo(RewardsPage);
