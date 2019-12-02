import React, { memo } from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Drawer from '@material-ui/core/Drawer';
import { makeStyles } from '@material-ui/core/styles';
import ListItemText from '@material-ui/core/ListItemText';

const useStyles = makeStyles({
  list: {
    width: '250px',
  },
});

const Sidebar: React.FC<{}> = () => {
  const cx = useStyles();
  return (
    <Drawer open={true}>
      <List className={cx.list}>
        <ListItem button>
          {/* This is a test */}
          {/* <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon> */}
          <ListItemText primary="This is a test" />
        </ListItem>
      </List>
    </Drawer>
  );
};

export default memo(Sidebar);
