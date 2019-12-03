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
import { useTranslation } from 'react-i18next';
import MailTo from 'react-mailto.js';

const log = debug('Sidebar');
const useStyles = makeStyles({
  list: {
    width: '250px',
  },
  mailto: {
    color: 'inherit',
    textDecoration: 'none',
  },
});

const Sidebar: React.FC<{}> = () => {
  const cx = useStyles();
  const [t] = useTranslation();
  const dispatch = useDispatch();
  const { isSidebarOpen } = useTypedSelector(s => s.ui);
  log('isSidebarOpen: ', isSidebarOpen);
  return (
    <Drawer
      open={isSidebarOpen}
      onClose={() => dispatch(toggleSidebar())}
    >
      <List className={cx.list}>
        <MailTo className={cx.mailto} secure to="paleyblog@gmail.com">
          <ListItem button>
            <ListItemText primary={t('feedback')} />
          </ListItem>
        </MailTo>
      </List>
    </Drawer>
  );
};

export default memo(Sidebar);
