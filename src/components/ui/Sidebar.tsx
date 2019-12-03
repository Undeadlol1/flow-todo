import React, { memo } from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Drawer from '@material-ui/core/Drawer';
import { makeStyles } from '@material-ui/core/styles';
import ListItemText from '@material-ui/core/ListItemText';
import { useTypedSelector } from '../../store/index';
import debug from 'debug';
import { useDispatch } from 'react-redux';
import { toggleSidebar } from '../../store/uiSlice';
import { Link } from 'react-router-dom';

const log = debug('Sidebar');
const useStyles = makeStyles({
  list: {
    width: '250px',
  },
});

const Sidebar: React.FC<{}> = () => {
  const cx = useStyles();
  const dispatch = useDispatch();
  const { isSidebarOpen } = useTypedSelector(s => s.ui);
  log('isSidebarOpen: ', isSidebarOpen);
  return (
    <Drawer
      open={isSidebarOpen}
      onClose={() => dispatch(toggleSidebar())}
    >
      <List className={cx.list}>
        <ListItem button>
          <ListItemText primary="This is a test" />
        </ListItem>
        <ListItem button component={Link} to="/rewards">
          <ListItemText primary="Rewards pagefgf" />
        </ListItem>
      </List>
    </Drawer>
  );
};

export default memo(Sidebar);
